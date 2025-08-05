/**
 * Subscription Repository
 *
 * Enterprise data access layer for newsletter subscriptions with:
 * - Type-safe database operations
 * - Connection pooling
 * - Query optimization
 * - Transaction support
 * - Analytics and reporting
 */

import { database } from "../database/connection";
import {
  SubscriptionRepository,
  SubscriptionEntity,
  CreateSubscriptionData,
  UpdateSubscriptionData,
  FindManyOptions,
  StatsOptions,
  SubscriptionStats,
} from "../database/types";
import { errorTracker, measurePerformance } from "../monitoring/error-tracking";

export class DatabaseSubscriptionRepository implements SubscriptionRepository {
  async create(data: CreateSubscriptionData): Promise<SubscriptionEntity> {
    const perf = measurePerformance("subscription.create");

    try {
      const id = this.generateId();
      const now = new Date();

      const query = `
        INSERT INTO subscriptions (
          id, email, status, source, first_name, last_name,
          created_at, updated_at, subscribed_at,
          ip_address, user_agent, referer, signup_source,
          utm_source, utm_medium, utm_campaign,
          consent_given, consent_timestamp, gdpr_consent, ccpa_opt_out,
          data_processing_purposes, legal_basis, email_provider
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9,
          $10, $11, $12, $13,
          $14, $15, $16,
          $17, $18, $19, $20,
          $21, $22, $23
        ) RETURNING *
      `;

      const values = [
        id,
        data.email.toLowerCase().trim(),
        "subscribed", // Default status
        data.source,
        data.firstName || null,
        data.lastName || null,
        now,
        now,
        now, // subscribed_at
        data.ipAddress || null,
        data.userAgent || null,
        data.referer || null,
        data.signupSource,
        data.utmSource || null,
        data.utmMedium || null,
        data.utmCampaign || null,
        data.consentGiven,
        data.consentTimestamp,
        data.gdprConsent,
        data.ccpaOptOut || false,
        data.dataProcessingPurposes,
        data.legalBasis,
        this.extractEmailProvider(data.email),
      ];

      const result = await database.query(query, values);

      if (result.rows.length === 0) {
        throw new Error("Failed to create subscription");
      }

      const subscription = this.transformDatabaseRow(
        result.rows[0] as Record<string, unknown>,
      );

      errorTracker.addBreadcrumb({
        message: "Subscription created",
        category: "database",
        level: "info",
        data: { subscriptionId: subscription.id, email: subscription.email },
      });

      return subscription;
    } catch (error) {
      errorTracker.captureError(error as Error, "error", {
        endpoint: "subscription.create",
        extra: { email: data.email, source: data.source },
      });
      throw error;
    } finally {
      perf.end();
    }
  }

  async findByEmail(email: string): Promise<SubscriptionEntity | null> {
    const perf = measurePerformance("subscription.findByEmail");

    try {
      const query = "SELECT * FROM subscriptions WHERE email = $1 LIMIT 1";
      const result = await database.query(query, [email.toLowerCase().trim()], {
        preferRead: true,
      });

      if (result.rows.length === 0) {
        return null;
      }

      return this.transformDatabaseRow(
        result.rows[0] as Record<string, unknown>,
      );
    } catch (error) {
      errorTracker.captureError(error as Error, "error", {
        endpoint: "subscription.findByEmail",
        extra: { email },
      });
      throw error;
    } finally {
      perf.end();
    }
  }

  async findById(id: string): Promise<SubscriptionEntity | null> {
    const perf = measurePerformance("subscription.findById");

    try {
      const query = "SELECT * FROM subscriptions WHERE id = $1 LIMIT 1";
      const result = await database.query(query, [id], {
        preferRead: true,
      });

      if (result.rows.length === 0) {
        return null;
      }

      return this.transformDatabaseRow(
        result.rows[0] as Record<string, unknown>,
      );
    } catch (error) {
      errorTracker.captureError(error as Error, "error", {
        endpoint: "subscription.findById",
        extra: { id },
      });
      throw error;
    } finally {
      perf.end();
    }
  }

  async update(
    id: string,
    data: UpdateSubscriptionData,
  ): Promise<SubscriptionEntity | null> {
    const perf = measurePerformance("subscription.update");

    try {
      const setClause: string[] = [];
      const values: unknown[] = [];
      let paramIndex = 1;

      // Always update the updated_at timestamp
      setClause.push(`updated_at = $${paramIndex++}`);
      values.push(new Date());

      // Build dynamic SET clause based on provided data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          const columnName = this.camelToSnake(key);
          setClause.push(`${columnName} = $${paramIndex++}`);
          values.push(value);
        }
      });

      if (setClause.length === 1) {
        // Only updated_at was set, nothing to update
        return this.findById(id);
      }

      values.push(id); // Add id for WHERE clause

      const query = `
        UPDATE subscriptions 
        SET ${setClause.join(", ")}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await database.query(query, values);

      if (result.rows.length === 0) {
        return null;
      }

      const subscription = this.transformDatabaseRow(
        result.rows[0] as Record<string, unknown>,
      );

      errorTracker.addBreadcrumb({
        message: "Subscription updated",
        category: "database",
        level: "info",
        data: {
          subscriptionId: subscription.id,
          updatedFields: Object.keys(data),
        },
      });

      return subscription;
    } catch (error) {
      errorTracker.captureError(error as Error, "error", {
        endpoint: "subscription.update",
        extra: { id, updateData: data },
      });
      throw error;
    } finally {
      perf.end();
    }
  }

  async delete(id: string): Promise<boolean> {
    const perf = measurePerformance("subscription.delete");

    try {
      const query = "DELETE FROM subscriptions WHERE id = $1";
      const result = await database.query(query, [id]);

      const deleted = (result.rowCount || 0) > 0;

      if (deleted) {
        errorTracker.addBreadcrumb({
          message: "Subscription deleted",
          category: "database",
          level: "warning",
          data: { subscriptionId: id },
        });
      }

      return deleted;
    } catch (error) {
      errorTracker.captureError(error as Error, "error", {
        endpoint: "subscription.delete",
        extra: { id },
      });
      throw error;
    } finally {
      perf.end();
    }
  }

  async findMany(options: FindManyOptions = {}): Promise<SubscriptionEntity[]> {
    const perf = measurePerformance("subscription.findMany");

    try {
      let query = "SELECT * FROM subscriptions";
      const conditions: string[] = [];
      const values: unknown[] = [];
      let paramIndex = 1;

      // Build WHERE clause
      if (options.where) {
        if (options.where.status) {
          if (Array.isArray(options.where.status)) {
            const placeholders = options.where.status
              .map(() => `$${paramIndex++}`)
              .join(", ");
            conditions.push(`status IN (${placeholders})`);
            values.push(...options.where.status);
          } else {
            conditions.push(`status = $${paramIndex++}`);
            values.push(options.where.status);
          }
        }

        if (options.where.source) {
          conditions.push(`source = $${paramIndex++}`);
          values.push(options.where.source);
        }

        if (options.where.emailProvider) {
          conditions.push(`email_provider = $${paramIndex++}`);
          values.push(options.where.emailProvider);
        }

        if (options.where.createdAfter) {
          conditions.push(`created_at >= $${paramIndex++}`);
          values.push(options.where.createdAfter);
        }

        if (options.where.createdBefore) {
          conditions.push(`created_at <= $${paramIndex++}`);
          values.push(options.where.createdBefore);
        }
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
      }

      // Add ORDER BY
      if (options.orderBy) {
        const column = this.camelToSnake(options.orderBy.field);
        query += ` ORDER BY ${column} ${options.orderBy.direction}`;
      } else {
        query += " ORDER BY created_at DESC";
      }

      // Add LIMIT and OFFSET
      if (options.limit) {
        query += ` LIMIT $${paramIndex++}`;
        values.push(options.limit);
      }

      if (options.offset) {
        query += ` OFFSET $${paramIndex++}`;
        values.push(options.offset);
      }

      const result = await database.query(query, values, {
        preferRead: true,
      });

      return result.rows.map((row) =>
        this.transformDatabaseRow(row as Record<string, unknown>),
      );
    } catch (error) {
      errorTracker.captureError(error as Error, "error", {
        endpoint: "subscription.findMany",
        extra: { options },
      });
      throw error;
    } finally {
      perf.end();
    }
  }

  async getStats(options: StatsOptions = {}): Promise<SubscriptionStats> {
    const perf = measurePerformance("subscription.getStats");

    try {
      const results = await Promise.all([
        this.getBasicStats(options),
        this.getSubscriptionsByPeriod(options),
        this.getEmailProviderStats(),
        this.getSourceDistribution(),
        this.getEngagementMetrics(),
      ]);

      const [
        basicStats,
        subscriptionsByPeriod,
        emailProviders,
        sources,
        engagement,
      ] = results;

      return {
        total: basicStats.total || 0,
        active: basicStats.active || 0,
        unsubscribed: basicStats.unsubscribed || 0,
        pending: basicStats.pending || 0,
        verified: basicStats.verified || 0,
        bounced: basicStats.bounced || 0,
        conversionRate: basicStats.conversionRate || 0,
        churnRate: basicStats.churnRate || 0,
        subscriptionsByPeriod,
        topEmailProviders: emailProviders,
        sourceDistribution: sources,
        engagementMetrics: engagement,
      };
    } catch (error) {
      errorTracker.captureError(error as Error, "error", {
        endpoint: "subscription.getStats",
        extra: { options },
      });
      throw error;
    } finally {
      perf.end();
    }
  }

  private async getBasicStats(
    options: StatsOptions,
  ): Promise<Partial<SubscriptionStats>> {
    let whereClause = "";
    const values: unknown[] = [];

    if (options.dateRange) {
      whereClause = "WHERE created_at BETWEEN $1 AND $2";
      values.push(options.dateRange.start, options.dateRange.end);
    }

    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status IN ('subscribed', 'verified')) as active,
        COUNT(*) FILTER (WHERE status = 'unsubscribed') as unsubscribed,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'verified') as verified,
        COUNT(*) FILTER (WHERE status = 'bounced') as bounced
      FROM subscriptions ${whereClause}
    `;

    const result = await database.query(query, values, { preferRead: true });
    const row = result.rows[0];

    const total = parseInt(row.total as string);
    const active = parseInt(row.active as string);

    return {
      total,
      active,
      unsubscribed: parseInt(row.unsubscribed as string),
      pending: parseInt(row.pending as string),
      verified: parseInt(row.verified as string),
      bounced: parseInt(row.bounced as string),
      conversionRate: total > 0 ? (active / total) * 100 : 0,
      churnRate:
        total > 0 ? (parseInt(row.unsubscribed as string) / total) * 100 : 0,
    };
  }

  private async getSubscriptionsByPeriod(
    options: StatsOptions,
  ): Promise<Array<{ period: string; count: number }>> {
    const groupBy = options.groupBy || "day";
    let dateFormat: string;

    switch (groupBy) {
      case "week":
        dateFormat = "TO_CHAR(created_at, 'YYYY-\"W\"WW')";
        break;
      case "month":
        dateFormat = "TO_CHAR(created_at, 'YYYY-MM')";
        break;
      default:
        dateFormat = "TO_CHAR(created_at, 'YYYY-MM-DD')";
    }

    let whereClause = "";
    const values: unknown[] = [];

    if (options.dateRange) {
      whereClause = "WHERE created_at BETWEEN $1 AND $2";
      values.push(options.dateRange.start, options.dateRange.end);
    }

    const query = `
      SELECT 
        ${dateFormat} as period,
        COUNT(*) as count
      FROM subscriptions ${whereClause}
      GROUP BY period
      ORDER BY period DESC
      LIMIT 30
    `;

    const result = await database.query(query, values, { preferRead: true });

    return result.rows.map((row) => ({
      period: row.period as string,
      count: parseInt(row.count as string),
    }));
  }

  private async getEmailProviderStats(): Promise<
    Array<{ provider: string; count: number; percentage: number }>
  > {
    const query = `
      SELECT 
        email_provider as provider,
        COUNT(*) as count,
        ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER()), 2) as percentage
      FROM subscriptions
      WHERE email_provider IS NOT NULL
      GROUP BY email_provider
      ORDER BY count DESC
      LIMIT 10
    `;

    const result = await database.query(query, [], { preferRead: true });

    return result.rows.map((row) => ({
      provider: row.provider as string,
      count: parseInt(row.count as string),
      percentage: parseFloat(row.percentage as string),
    }));
  }

  private async getSourceDistribution(): Promise<
    Array<{ source: string; count: number; percentage: number }>
  > {
    const query = `
      SELECT 
        source,
        COUNT(*) as count,
        ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER()), 2) as percentage
      FROM subscriptions
      GROUP BY source
      ORDER BY count DESC
      LIMIT 10
    `;

    const result = await database.query(query, [], { preferRead: true });

    return result.rows.map((row) => ({
      source: row.source as string,
      count: parseInt(row.count as string),
      percentage: parseFloat(row.percentage as string),
    }));
  }

  private async getEngagementMetrics(): Promise<
    SubscriptionStats["engagementMetrics"]
  > {
    const query = `
      SELECT 
        AVG(total_opens) as avg_opens,
        AVG(total_clicks) as avg_clicks,
        COUNT(*) FILTER (WHERE total_opens > 0) * 100.0 / COUNT(*) as open_rate,
        COUNT(*) FILTER (WHERE total_clicks > 0) * 100.0 / COUNT(*) as click_rate
      FROM subscriptions
      WHERE status IN ('subscribed', 'verified')
    `;

    const result = await database.query(query, [], { preferRead: true });
    const row = result.rows[0];

    return {
      averageOpens: parseFloat(row.avg_opens as string) || 0,
      averageClicks: parseFloat(row.avg_clicks as string) || 0,
      openRate: parseFloat(row.open_rate as string) || 0,
      clickRate: parseFloat(row.click_rate as string) || 0,
    };
  }

  private generateId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private extractEmailProvider(email: string): string {
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) return "unknown";

    const providerMap: Record<string, string> = {
      "gmail.com": "Gmail",
      "yahoo.com": "Yahoo",
      "hotmail.com": "Hotmail",
      "outlook.com": "Outlook",
      "icloud.com": "iCloud",
      "aol.com": "AOL",
      "protonmail.com": "ProtonMail",
      "hey.com": "Hey",
    };

    return providerMap[domain] || domain;
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }

  private transformDatabaseRow(
    row: Record<string, unknown>,
  ): SubscriptionEntity {
    return {
      id: row.id as string,
      email: row.email as string,
      status: row.status as SubscriptionEntity["status"],
      source: row.source as string,
      firstName: row.first_name as string | undefined,
      lastName: row.last_name as string | undefined,
      createdAt: new Date(row.created_at as string | number | Date),
      updatedAt: new Date(row.updated_at as string | number | Date),
      subscribedAt: row.subscribed_at
        ? new Date(row.subscribed_at as string | number | Date)
        : undefined,
      verifiedAt: row.verified_at
        ? new Date(row.verified_at as string | number | Date)
        : undefined,
      unsubscribedAt: row.unsubscribed_at
        ? new Date(row.unsubscribed_at as string | number | Date)
        : undefined,
      ipAddress: row.ip_address as string | undefined,
      userAgent: row.user_agent as string | undefined,
      referer: row.referer as string | undefined,
      signupSource: row.signup_source as string,
      utmSource: row.utm_source as string | undefined,
      utmMedium: row.utm_medium as string | undefined,
      utmCampaign: row.utm_campaign as string | undefined,
      consentGiven: row.consent_given as boolean,
      consentTimestamp: new Date(
        row.consent_timestamp as string | number | Date,
      ),
      gdprConsent: row.gdpr_consent as boolean,
      ccpaOptOut: row.ccpa_opt_out as boolean,
      dataProcessingPurposes: (row.data_processing_purposes as string[]) || [],
      legalBasis: row.legal_basis as SubscriptionEntity["legalBasis"],
      emailProvider: row.email_provider as string | undefined,
      bounceCount: (row.bounce_count as number) || 0,
      lastEmailSent: row.last_email_sent
        ? new Date(row.last_email_sent as string | number | Date)
        : undefined,
      lastOpened: row.last_opened
        ? new Date(row.last_opened as string | number | Date)
        : undefined,
      totalOpens: (row.total_opens as number) || 0,
      totalClicks: (row.total_clicks as number) || 0,
      unsubscribeReason: row.unsubscribe_reason as string | undefined,
      unsubscribeFeedback: row.unsubscribe_feedback as string | undefined,
    };
  }
}

// Singleton instance
export const subscriptionRepository = new DatabaseSubscriptionRepository();
