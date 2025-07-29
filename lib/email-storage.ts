import { promises as fs } from "fs";
import path from "path";

/**
 * Local Email Storage System
 *
 * A lightweight JSON-based email storage solution that provides:
 * - Data backup and ownership
 * - Analytics and reporting capabilities
 * - GDPR compliance support
 * - Easy migration path to full database
 *
 * For production scale, consider migrating to PostgreSQL/SQLite
 */

export interface EmailSubscription {
  id: string;
  email: string;
  status: "pending" | "verified" | "subscribed" | "unsubscribed";
  source: string;
  subscribedAt: string;
  verifiedAt?: string;
  lastEmailSent?: string;
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    referer?: string;
    consentGiven: boolean;
    consentTimestamp: string;
    emailProvider?: string;
    signupSource: string;
    unsubscribeReason?: string;
    unsubscribeDate?: string;
  };
}

export interface EmailStorageStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  unsubscribed: number;
  pending: number;
  verified: number;
  subscriptionsByMonth: Record<string, number>;
  topEmailProviders: Record<string, number>;
  sources: Record<string, number>;
}

class EmailStorage {
  private filePath: string;
  private backupPath: string;

  constructor() {
    // Store in data directory (create if doesn't exist)
    const dataDir = path.join(process.cwd(), "data");
    this.filePath = path.join(dataDir, "email-subscriptions.json");
    this.backupPath = path.join(dataDir, "email-subscriptions-backup.json");
  }

  private async ensureDataDirectory(): Promise<void> {
    const dataDir = path.dirname(this.filePath);
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }
  }

  private async readSubscriptions(): Promise<EmailSubscription[]> {
    try {
      await this.ensureDataDirectory();
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch {
      // File doesn't exist or is invalid, return empty array
      return [];
    }
  }

  private async writeSubscriptions(
    subscriptions: EmailSubscription[],
  ): Promise<void> {
    await this.ensureDataDirectory();

    // Create backup of existing data
    try {
      const existingData = await fs.readFile(this.filePath, "utf-8");
      await fs.writeFile(this.backupPath, existingData);
    } catch {
      // No existing file to backup
    }

    // Write new data
    await fs.writeFile(this.filePath, JSON.stringify(subscriptions, null, 2));
  }

  private generateId(): string {
    return `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private extractEmailProvider(email: string): string {
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) return "unknown";

    // Map common providers
    const providerMap: Record<string, string> = {
      "gmail.com": "Gmail",
      "yahoo.com": "Yahoo",
      "hotmail.com": "Hotmail",
      "outlook.com": "Outlook",
      "icloud.com": "iCloud",
      "aol.com": "AOL",
      "protonmail.com": "ProtonMail",
    };

    return providerMap[domain] || domain;
  }

  async addSubscription(data: {
    email: string;
    source?: string;
    ipAddress?: string;
    userAgent?: string;
    referer?: string;
    signupSource?: string;
  }): Promise<EmailSubscription> {
    const subscriptions = await this.readSubscriptions();

    // Check if email already exists
    const existingIndex = subscriptions.findIndex(
      (sub) => sub.email === data.email,
    );

    const subscription: EmailSubscription = {
      id: this.generateId(),
      email: data.email,
      status: "subscribed", // Default to subscribed for now
      source: data.source || "website",
      subscribedAt: new Date().toISOString(),
      metadata: {
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        referer: data.referer,
        consentGiven: true, // Implied by form submission
        consentTimestamp: new Date().toISOString(),
        emailProvider: this.extractEmailProvider(data.email),
        signupSource: data.signupSource || "Newsletter form",
      },
    };

    if (existingIndex >= 0) {
      // Update existing subscription
      subscriptions[existingIndex] = {
        ...subscriptions[existingIndex],
        status: "subscribed",
        subscribedAt: new Date().toISOString(),
        metadata: {
          ...subscriptions[existingIndex].metadata,
          ...subscription.metadata,
        },
      };
    } else {
      // Add new subscription
      subscriptions.push(subscription);
    }

    await this.writeSubscriptions(subscriptions);
    return existingIndex >= 0 ? subscriptions[existingIndex] : subscription;
  }

  async getSubscription(email: string): Promise<EmailSubscription | null> {
    const subscriptions = await this.readSubscriptions();
    return subscriptions.find((sub) => sub.email === email) || null;
  }

  async updateSubscriptionStatus(
    email: string,
    status: EmailSubscription["status"],
    metadata?: Partial<EmailSubscription["metadata"]>,
  ): Promise<EmailSubscription | null> {
    const subscriptions = await this.readSubscriptions();
    const index = subscriptions.findIndex((sub) => sub.email === email);

    if (index >= 0) {
      subscriptions[index].status = status;
      if (status === "verified") {
        subscriptions[index].verifiedAt = new Date().toISOString();
      }
      if (metadata) {
        subscriptions[index].metadata = {
          ...subscriptions[index].metadata,
          ...metadata,
        };
      }

      await this.writeSubscriptions(subscriptions);
      return subscriptions[index];
    }

    return null;
  }

  async getAllSubscriptions(): Promise<EmailSubscription[]> {
    return this.readSubscriptions();
  }

  async getActiveSubscriptions(): Promise<EmailSubscription[]> {
    const subscriptions = await this.readSubscriptions();
    return subscriptions.filter(
      (sub) => sub.status === "subscribed" || sub.status === "verified",
    );
  }

  async getStats(): Promise<EmailStorageStats> {
    const subscriptions = await this.readSubscriptions();

    const stats: EmailStorageStats = {
      totalSubscriptions: subscriptions.length,
      activeSubscriptions: subscriptions.filter(
        (sub) => sub.status === "subscribed" || sub.status === "verified",
      ).length,
      unsubscribed: subscriptions.filter((sub) => sub.status === "unsubscribed")
        .length,
      pending: subscriptions.filter((sub) => sub.status === "pending").length,
      verified: subscriptions.filter((sub) => sub.status === "verified").length,
      subscriptionsByMonth: {},
      topEmailProviders: {},
      sources: {},
    };

    // Calculate monthly subscriptions
    subscriptions.forEach((sub) => {
      const month = sub.subscribedAt.substring(0, 7); // YYYY-MM
      stats.subscriptionsByMonth[month] =
        (stats.subscriptionsByMonth[month] || 0) + 1;
    });

    // Calculate email provider distribution
    subscriptions.forEach((sub) => {
      const provider = sub.metadata.emailProvider || "unknown";
      stats.topEmailProviders[provider] =
        (stats.topEmailProviders[provider] || 0) + 1;
    });

    // Calculate source distribution
    subscriptions.forEach((sub) => {
      const source = sub.source;
      stats.sources[source] = (stats.sources[source] || 0) + 1;
    });

    return stats;
  }

  async deleteSubscription(email: string): Promise<boolean> {
    const subscriptions = await this.readSubscriptions();
    const initialLength = subscriptions.length;
    const filtered = subscriptions.filter((sub) => sub.email !== email);

    if (filtered.length < initialLength) {
      await this.writeSubscriptions(filtered);
      return true;
    }

    return false;
  }

  async exportData(): Promise<EmailSubscription[]> {
    return this.getAllSubscriptions();
  }
}

// Singleton instance
export const emailStorage = new EmailStorage();
