/**
 * Database Types and Interfaces
 *
 * Type definitions for enterprise database operations
 */

import { PoolConfig } from "pg";

export interface DatabaseConfig {
  write: PoolConfig;
  read: PoolConfig;
}

export interface QueryResult<T = Record<string, unknown>> {
  rows: T[];
  rowCount: number;
  duration: number;
  pool: "read" | "write";
}

export interface QueryOptions {
  preferRead?: boolean;
  slowQueryThreshold?: number;
  timeout?: number;
}

export interface TransactionClient {
  query<T = Record<string, unknown>>(
    text: string,
    params?: unknown[],
  ): Promise<QueryResult<T>>;
}

export type TransactionCallback<T> = (client: TransactionClient) => Promise<T>;

// Repository interfaces for type safety
export interface SubscriptionRepository {
  create(subscription: CreateSubscriptionData): Promise<SubscriptionEntity>;
  findByEmail(email: string): Promise<SubscriptionEntity | null>;
  findById(id: string): Promise<SubscriptionEntity | null>;
  update(
    id: string,
    data: UpdateSubscriptionData,
  ): Promise<SubscriptionEntity | null>;
  delete(id: string): Promise<boolean>;
  findMany(options: FindManyOptions): Promise<SubscriptionEntity[]>;
  getStats(options?: StatsOptions): Promise<SubscriptionStats>;
}

export interface CreateSubscriptionData {
  email: string;
  source: string;
  firstName?: string;
  lastName?: string;
  ipAddress?: string;
  userAgent?: string;
  referer?: string;
  signupSource: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  consentGiven: boolean;
  consentTimestamp: Date;
  gdprConsent: boolean;
  ccpaOptOut?: boolean;
  dataProcessingPurposes: string[];
  legalBasis:
    | "consent"
    | "legitimate_interest"
    | "contract"
    | "legal_obligation";
}

export interface UpdateSubscriptionData {
  status?: "pending" | "verified" | "subscribed" | "unsubscribed" | "bounced";
  firstName?: string;
  lastName?: string;
  verifiedAt?: Date;
  unsubscribedAt?: Date;
  bounceCount?: number;
  lastEmailSent?: Date;
  lastOpened?: Date;
  totalOpens?: number;
  totalClicks?: number;
  unsubscribeReason?: string;
  unsubscribeFeedback?: string;
}

export interface SubscriptionEntity {
  id: string;
  email: string;
  status: "pending" | "verified" | "subscribed" | "unsubscribed" | "bounced";
  source: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
  subscribedAt?: Date;
  verifiedAt?: Date;
  unsubscribedAt?: Date;
  ipAddress?: string;
  userAgent?: string;
  referer?: string;
  signupSource: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  consentGiven: boolean;
  consentTimestamp: Date;
  gdprConsent: boolean;
  ccpaOptOut: boolean;
  dataProcessingPurposes: string[];
  legalBasis:
    | "consent"
    | "legitimate_interest"
    | "contract"
    | "legal_obligation";
  emailProvider?: string;
  bounceCount: number;
  lastEmailSent?: Date;
  lastOpened?: Date;
  totalOpens: number;
  totalClicks: number;
  unsubscribeReason?: string;
  unsubscribeFeedback?: string;
}

export interface FindManyOptions {
  where?: {
    status?: string | string[];
    source?: string;
    emailProvider?: string;
    createdAfter?: Date;
    createdBefore?: Date;
  };
  orderBy?: {
    field: keyof SubscriptionEntity;
    direction: "ASC" | "DESC";
  };
  limit?: number;
  offset?: number;
}

export interface StatsOptions {
  dateRange?: {
    start: Date;
    end: Date;
  };
  groupBy?: "day" | "week" | "month";
}

export interface SubscriptionStats {
  total: number;
  active: number;
  unsubscribed: number;
  pending: number;
  verified: number;
  bounced: number;
  subscriptionsByPeriod: Array<{
    period: string;
    count: number;
  }>;
  topEmailProviders: Array<{
    provider: string;
    count: number;
    percentage: number;
  }>;
  sourceDistribution: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
  conversionRate: number;
  churnRate: number;
  engagementMetrics: {
    averageOpens: number;
    averageClicks: number;
    openRate: number;
    clickRate: number;
  };
}

// Rate limiting types
export interface RateLimitEntry {
  identifier: string;
  endpoint: string;
  count: number;
  windowStart: Date;
  windowSizeMs: number;
  maxRequests: number;
}

export interface RateLimitResult {
  allowed: boolean;
  count: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (request: {
    ip?: string;
    headers?: Record<string, string>;
  }) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

// Audit logging types
export interface AuditLogEntry {
  action: string;
  resourceType: string;
  resourceId?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  details: Record<string, unknown>;
}

// API Key types
export interface ApiKeyData {
  name: string;
  permissions: string[];
  rateLimit: number;
  expiresAt?: Date;
}

export interface ApiKeyEntity {
  id: string;
  name: string;
  keyHash: string;
  permissions: string[];
  rateLimit: number;
  createdBy?: string;
  createdAt: Date;
  expiresAt?: Date;
  lastUsed?: Date;
  isActive: boolean;
}

// Health check types
export interface HealthCheckResult {
  service: string;
  status: "healthy" | "degraded" | "unhealthy";
  responseTimeMs?: number;
  errorMessage?: string;
  metadata: Record<string, unknown>;
  checkedAt: Date;
}

// Migration types
export interface Migration {
  version: string;
  name: string;
  sql: string;
  checksum: string;
}

export interface MigrationResult {
  success: boolean;
  appliedMigrations: string[];
  errors: string[];
}
