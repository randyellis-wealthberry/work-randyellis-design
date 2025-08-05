/**
 * Enterprise Database Connection Pool
 *
 * Handles PostgreSQL connections with:
 * - Connection pooling for performance
 * - Read replica support for scalability
 * - Health monitoring and automatic failover
 * - Transaction management
 * - Query optimization and logging
 */

import { Pool, PoolConfig } from "pg";
import {
  DatabaseConfig,
  QueryResult,
  QueryOptions,
  TransactionCallback,
} from "./types";

class DatabaseManager {
  private writePool: Pool | null = null;
  private readPool: Pool | null = null;
  private isConnected = false;
  private connectionRetries = 0;
  private maxRetries = 3;

  private readonly config: DatabaseConfig;

  constructor() {
    this.config = this.getConfig();
  }

  private getConfig(): DatabaseConfig {
    const baseConfig: PoolConfig = {
      host: process.env.DATABASE_HOST || "localhost",
      port: parseInt(process.env.DATABASE_PORT || "5432"),
      database: process.env.DATABASE_NAME || "portfolio",
      user: process.env.DATABASE_USER || "postgres",
      password: process.env.DATABASE_PASSWORD,

      // Connection pool settings for production scale
      min: parseInt(process.env.DATABASE_POOL_MIN || "2"),
      max: parseInt(process.env.DATABASE_POOL_MAX || "20"),
      idleTimeoutMillis: parseInt(process.env.DATABASE_IDLE_TIMEOUT || "30000"),
      connectionTimeoutMillis: parseInt(
        process.env.DATABASE_CONNECTION_TIMEOUT || "10000",
      ),

      // SSL configuration for production
      ssl:
        process.env.DATABASE_SSL === "true"
          ? {
              rejectUnauthorized:
                process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false",
            }
          : false,

      // Application name for monitoring
      application_name: "portfolio-api",
    };

    return {
      write: baseConfig,
      read: process.env.DATABASE_READ_HOST
        ? {
            ...baseConfig,
            host: process.env.DATABASE_READ_HOST,
            port: parseInt(
              process.env.DATABASE_READ_PORT ||
                process.env.DATABASE_PORT ||
                "5432",
            ),
          }
        : baseConfig,
    };
  }

  async connect(): Promise<void> {
    if (this.isConnected) return;

    try {
      // Initialize write pool
      this.writePool = new Pool(this.config.write);

      // Initialize read pool (may be same as write pool)
      this.readPool = new Pool(this.config.read);

      // Test connections
      await this.testConnections();

      this.isConnected = true;
      this.connectionRetries = 0;

      console.log("Database connection established successfully");

      // Set up connection event handlers
      this.setupEventHandlers();
    } catch (error) {
      this.connectionRetries++;
      console.error(
        `Database connection failed (attempt ${this.connectionRetries}/${this.maxRetries}):`,
        error,
      );

      if (this.connectionRetries >= this.maxRetries) {
        throw new Error(
          `Failed to connect to database after ${this.maxRetries} attempts`,
        );
      }

      // Exponential backoff retry
      const delay = Math.pow(2, this.connectionRetries) * 1000;
      setTimeout(() => this.connect(), delay);
    }
  }

  private async testConnections(): Promise<void> {
    if (!this.writePool || !this.readPool) {
      throw new Error("Database pools not initialized");
    }

    // Test write connection
    const writeClient = await this.writePool.connect();
    try {
      await writeClient.query("SELECT 1");
    } finally {
      writeClient.release();
    }

    // Test read connection
    const readClient = await this.readPool.connect();
    try {
      await readClient.query("SELECT 1");
    } finally {
      readClient.release();
    }
  }

  private setupEventHandlers(): void {
    if (!this.writePool || !this.readPool) return;

    // Write pool events
    this.writePool.on("error", (err) => {
      console.error("Unexpected error on write database connection:", err);
      this.handleConnectionError();
    });

    this.writePool.on("connect", () => {
      console.log("New write database connection established");
    });

    // Read pool events
    this.readPool.on("error", (err) => {
      console.error("Unexpected error on read database connection:", err);
    });

    this.readPool.on("connect", () => {
      console.log("New read database connection established");
    });
  }

  private handleConnectionError(): void {
    this.isConnected = false;

    // Attempt to reconnect after a delay
    setTimeout(() => {
      this.connect().catch(console.error);
    }, 5000);
  }

  async query<T = Record<string, unknown>>(
    text: string,
    params?: unknown[],
    options: QueryOptions = {},
  ): Promise<QueryResult<T>> {
    const startTime = Date.now();
    const useReadPool =
      options.preferRead && this.readPool && this.readPool !== this.writePool;
    const pool = useReadPool ? this.readPool : this.writePool;

    if (!pool) {
      throw new Error("Database not connected");
    }

    try {
      const result = await pool.query(text, params);
      const duration = Date.now() - startTime;

      // Log slow queries
      if (duration > (options.slowQueryThreshold || 1000)) {
        console.warn(`Slow query detected (${duration}ms):`, {
          query: text.substring(0, 100) + (text.length > 100 ? "..." : ""),
          duration,
          pool: useReadPool ? "read" : "write",
        });
      }

      return {
        rows: result.rows,
        rowCount: result.rowCount || 0,
        duration,
        pool: useReadPool ? "read" : "write",
      };
    } catch (error) {
      console.error("Query execution failed:", {
        query: text.substring(0, 100) + (text.length > 100 ? "..." : ""),
        error: error instanceof Error ? error.message : error,
        duration: Date.now() - startTime,
      });
      throw error;
    }
  }

  async transaction<T>(callback: TransactionCallback<T>): Promise<T> {
    if (!this.writePool) {
      throw new Error("Database not connected");
    }

    const client = await this.writePool.connect();

    try {
      await client.query("BEGIN");

      const result = await callback({
        query: async (text: string, params?: unknown[]) => {
          const result = await client.query(text, params);
          return {
            rows: result.rows,
            rowCount: result.rowCount || 0,
            duration: 0,
            pool: "write" as const,
          };
        },
      });

      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async getPoolStats() {
    if (!this.writePool || !this.readPool) {
      return null;
    }

    return {
      write: {
        totalCount: this.writePool.totalCount,
        idleCount: this.writePool.idleCount,
        waitingCount: this.writePool.waitingCount,
      },
      read:
        this.readPool === this.writePool
          ? "same_as_write"
          : {
              totalCount: this.readPool.totalCount,
              idleCount: this.readPool.idleCount,
              waitingCount: this.readPool.waitingCount,
            },
    };
  }

  async healthCheck(): Promise<{
    write: boolean;
    read: boolean;
    poolStats: Record<string, unknown> | null;
  }> {
    const results = {
      write: false,
      read: false,
      poolStats: null as Record<string, unknown> | null,
    };

    try {
      // Test write connection
      if (this.writePool) {
        await this.query("SELECT 1");
        results.write = true;
      }

      // Test read connection
      if (this.readPool) {
        await this.query("SELECT 1", [], { preferRead: true });
        results.read = true;
      }

      results.poolStats = await this.getPoolStats();
    } catch (error) {
      console.error("Database health check failed:", error);
    }

    return results;
  }

  async disconnect(): Promise<void> {
    const closePromises = [];

    if (this.writePool) {
      closePromises.push(this.writePool.end());
    }

    if (this.readPool && this.readPool !== this.writePool) {
      closePromises.push(this.readPool.end());
    }

    await Promise.all(closePromises);

    this.writePool = null;
    this.readPool = null;
    this.isConnected = false;

    console.log("Database connections closed");
  }
}

// Singleton instance
export const database = new DatabaseManager();

// Auto-connect on module load in production
if (
  process.env.NODE_ENV === "production" ||
  process.env.AUTO_CONNECT_DB === "true"
) {
  database.connect().catch(console.error);
}
