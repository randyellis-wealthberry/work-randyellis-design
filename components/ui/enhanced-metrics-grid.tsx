"use client";

import { AnimatedMetricCard } from "@/components/ui/animated-metric-card";
import { Project } from "@/lib/data/types";

interface EnhancedMetricsGridProps {
  metrics: Project["metrics"];
  className?: string;
}

export function EnhancedMetricsGrid({
  metrics = [],
  className = "",
}: EnhancedMetricsGridProps) {
  if (!metrics || metrics.length === 0) {
    return null;
  }

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 ${className}`}
    >
      {metrics.map((metric, index) => (
        <AnimatedMetricCard
          key={`${metric.label}-${index}`}
          label={metric.label}
          value={metric.value}
          performanceLevel={metric.performanceLevel || "neutral"}
          animationDelay={index * 100}
          springOptions={{
            bounce: 0,
            duration: 2000,
          }}
          className="h-full"
        />
      ))}
    </div>
  );
}

// Thematic sections component for better organization
interface ThematicMetricsSectionProps {
  title: string;
  description?: string;
  metrics: Project["metrics"];
  className?: string;
}

export function ThematicMetricsSection({
  title,
  description,
  metrics = [],
  className = "",
}: ThematicMetricsSectionProps) {
  if (!metrics || metrics.length === 0) {
    return null;
  }

  return (
    <section className={`space-y-6 ${className}`}>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        )}
      </div>

      <EnhancedMetricsGrid metrics={metrics} className="justify-center" />
    </section>
  );
}

// Complete project metrics display with thematic organization
interface ProjectMetricsDisplayProps {
  project: Project;
  showThematicSections?: boolean;
  className?: string;
}

export function ProjectMetricsDisplay({
  project,
  showThematicSections = false,
  className = "",
}: ProjectMetricsDisplayProps) {
  const metrics = project.metrics || [];

  if (metrics.length === 0) {
    return null;
  }

  if (!showThematicSections) {
    return (
      <div className={className}>
        <EnhancedMetricsGrid metrics={metrics} />
      </div>
    );
  }

  // Organize metrics thematically for better storytelling
  const userExperienceMetrics = metrics.filter(
    (metric) =>
      metric.label.includes("User") ||
      metric.label.includes("Student") ||
      metric.label.includes("Feature") ||
      metric.label.includes("Quality") ||
      metric.label.includes("Onboarding"),
  );

  const performanceMetrics = metrics.filter(
    (metric) =>
      metric.label.includes("Export") ||
      metric.label.includes("Processing") ||
      metric.label.includes("Compatibility") ||
      metric.label.includes("Crash") ||
      metric.label.includes("Time to"),
  );

  const engagementMetrics = metrics.filter(
    (metric) =>
      metric.label.includes("Active Users") ||
      metric.label.includes("Session") ||
      metric.label.includes("Retention") ||
      metric.label.includes("Reels Created"),
  );

  const socialMetrics = metrics.filter(
    (metric) =>
      metric.label.includes("Share") ||
      metric.label.includes("Rating") ||
      metric.label.includes("Reduction"),
  );

  return (
    <div className={`space-y-12 ${className}`}>
      {userExperienceMetrics.length > 0 && (
        <ThematicMetricsSection
          title="User Experience Excellence"
          description="Metrics demonstrating exceptional user satisfaction and interface effectiveness"
          metrics={userExperienceMetrics}
        />
      )}

      {performanceMetrics.length > 0 && (
        <ThematicMetricsSection
          title="Performance & Technical Achievement"
          description="Technical benchmarks showcasing robust engineering and optimization"
          metrics={performanceMetrics}
        />
      )}

      {engagementMetrics.length > 0 && (
        <ThematicMetricsSection
          title="Engagement & Growth"
          description="User behavior patterns indicating strong product-market fit"
          metrics={engagementMetrics}
        />
      )}

      {socialMetrics.length > 0 && (
        <ThematicMetricsSection
          title="Social & Sharing Success"
          description="Community adoption and viral growth indicators"
          metrics={socialMetrics}
        />
      )}
    </div>
  );
}
