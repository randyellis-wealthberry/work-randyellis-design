/**
 * Enterprise Database Schema
 *
 * Defines the database schema for scalable production infrastructure.
 * Supports PostgreSQL with connection pooling, read replicas, and migrations.
 */

export interface DatabaseSubscription {
  id: string;
  email: string;
  status: "pending" | "verified" | "subscribed" | "unsubscribed" | "bounced";
  source: string;
  first_name?: string;
  last_name?: string;

  // Timestamps
  created_at: Date;
  updated_at: Date;
  subscribed_at?: Date;
  verified_at?: Date;
  unsubscribed_at?: Date;

  // Tracking & Analytics
  ip_address?: string;
  user_agent?: string;
  referer?: string;
  signup_source: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;

  // Compliance & Privacy
  consent_given: boolean;
  consent_timestamp: Date;
  gdpr_consent: boolean;
  ccpa_opt_out: boolean;
  data_processing_purposes: string[];
  legal_basis:
    | "consent"
    | "legitimate_interest"
    | "contract"
    | "legal_obligation";

  // Email Analytics
  email_provider?: string;
  bounce_count: number;
  last_email_sent?: Date;
  last_opened?: Date;
  total_opens: number;
  total_clicks: number;

  // Unsubscribe tracking
  unsubscribe_reason?: string;
  unsubscribe_feedback?: string;
}

export interface DatabaseApiKey {
  id: string;
  name: string;
  key_hash: string;
  permissions: string[];
  rate_limit: number;
  created_by?: string;
  created_at: Date;
  expires_at?: Date;
  last_used?: Date;
  is_active: boolean;
}

export interface DatabaseRateLimit {
  id: string;
  identifier: string; // IP address or API key
  endpoint: string;
  count: number;
  window_start: Date;
  window_size_ms: number;
  max_requests: number;
}

export interface DatabaseAuditLog {
  id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  details: Record<string, unknown>;
  created_at: Date;
}

export interface DatabaseHealthCheck {
  id: string;
  service: string;
  status: "healthy" | "degraded" | "unhealthy";
  response_time_ms?: number;
  error_message?: string;
  metadata: Record<string, unknown>;
  checked_at: Date;
}

// SQL Schema Definitions
export const SQL_SCHEMA = {
  subscriptions: `
    CREATE TABLE IF NOT EXISTS subscriptions (
      id VARCHAR(255) PRIMARY KEY,
      email VARCHAR(254) UNIQUE NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      source VARCHAR(100) NOT NULL,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      subscribed_at TIMESTAMP WITH TIME ZONE,
      verified_at TIMESTAMP WITH TIME ZONE,
      unsubscribed_at TIMESTAMP WITH TIME ZONE,
      
      ip_address INET,
      user_agent TEXT,
      referer TEXT,
      signup_source VARCHAR(100) NOT NULL,
      utm_source VARCHAR(100),
      utm_medium VARCHAR(100),
      utm_campaign VARCHAR(100),
      
      consent_given BOOLEAN NOT NULL DEFAULT false,
      consent_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
      gdpr_consent BOOLEAN NOT NULL DEFAULT false,
      ccpa_opt_out BOOLEAN NOT NULL DEFAULT false,
      data_processing_purposes TEXT[] NOT NULL DEFAULT '{}',
      legal_basis VARCHAR(50) NOT NULL DEFAULT 'consent',
      
      email_provider VARCHAR(100),
      bounce_count INTEGER NOT NULL DEFAULT 0,
      last_email_sent TIMESTAMP WITH TIME ZONE,
      last_opened TIMESTAMP WITH TIME ZONE,
      total_opens INTEGER NOT NULL DEFAULT 0,
      total_clicks INTEGER NOT NULL DEFAULT 0,
      
      unsubscribe_reason VARCHAR(255),
      unsubscribe_feedback TEXT
    );
    
    CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON subscriptions(email);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_created_at ON subscriptions(created_at);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_source ON subscriptions(source);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_email_provider ON subscriptions(email_provider);
  `,

  api_keys: `
    CREATE TABLE IF NOT EXISTS api_keys (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      key_hash VARCHAR(255) UNIQUE NOT NULL,
      permissions TEXT[] NOT NULL DEFAULT '{}',
      rate_limit INTEGER NOT NULL DEFAULT 100,
      created_by VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      expires_at TIMESTAMP WITH TIME ZONE,
      last_used TIMESTAMP WITH TIME ZONE,
      is_active BOOLEAN NOT NULL DEFAULT true
    );
    
    CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
    CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);
  `,

  rate_limits: `
    CREATE TABLE IF NOT EXISTS rate_limits (
      id VARCHAR(255) PRIMARY KEY,
      identifier VARCHAR(255) NOT NULL,
      endpoint VARCHAR(255) NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      window_start TIMESTAMP WITH TIME ZONE NOT NULL,
      window_size_ms INTEGER NOT NULL,
      max_requests INTEGER NOT NULL,
      
      UNIQUE(identifier, endpoint, window_start)
    );
    
    CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier);
    CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start ON rate_limits(window_start);
  `,

  audit_logs: `
    CREATE TABLE IF NOT EXISTS audit_logs (
      id VARCHAR(255) PRIMARY KEY,
      action VARCHAR(100) NOT NULL,
      resource_type VARCHAR(100) NOT NULL,
      resource_id VARCHAR(255),
      user_id VARCHAR(255),
      ip_address INET,
      user_agent TEXT,
      details JSONB,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON audit_logs(resource_type);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
  `,

  health_checks: `
    CREATE TABLE IF NOT EXISTS health_checks (
      id VARCHAR(255) PRIMARY KEY,
      service VARCHAR(100) NOT NULL,
      status VARCHAR(20) NOT NULL,
      response_time_ms INTEGER,
      error_message TEXT,
      metadata JSONB,
      checked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS idx_health_checks_service ON health_checks(service);
    CREATE INDEX IF NOT EXISTS idx_health_checks_status ON health_checks(status);
    CREATE INDEX IF NOT EXISTS idx_health_checks_checked_at ON health_checks(checked_at);
  `,
};

// Migration tracking
export interface DatabaseMigration {
  id: string;
  version: string;
  name: string;
  sql: string;
  applied_at: Date;
  checksum: string;
}

export const MIGRATION_SCHEMA = `
  CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    version VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    sql TEXT NOT NULL,
    applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    checksum VARCHAR(64) NOT NULL
  );
`;
