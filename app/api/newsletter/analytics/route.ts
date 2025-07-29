import { NextResponse } from "next/server";
import { emailStorage } from "@/lib/email-storage";

export async function GET() {
  try {
    const subscriptions = await emailStorage.getAllSubscriptions();
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Basic stats
    const totalSubscriptions = subscriptions.length;
    const activeSubscriptions = subscriptions.filter(
      (sub) => sub.status === "subscribed" || sub.status === "verified",
    ).length;

    // Time-based analytics
    const last30Days = subscriptions.filter(
      (sub) => new Date(sub.subscribedAt) >= thirtyDaysAgo,
    ).length;
    const last7Days = subscriptions.filter(
      (sub) => new Date(sub.subscribedAt) >= sevenDaysAgo,
    ).length;
    const last24Hours = subscriptions.filter(
      (sub) => new Date(sub.subscribedAt) >= oneDayAgo,
    ).length;

    // Growth rate calculation
    const previousMonth = subscriptions.filter((sub) => {
      const subDate = new Date(sub.subscribedAt);
      const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      return subDate >= twoMonthsAgo && subDate < thirtyDaysAgo;
    }).length;

    const growthRate =
      previousMonth > 0
        ? ((last30Days - previousMonth) / previousMonth) * 100
        : last30Days > 0
          ? 100
          : 0;

    // Source analysis
    const sourceBreakdown = subscriptions.reduce(
      (acc, sub) => {
        const source = sub.metadata.signupSource || sub.source || "unknown";
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Referrer analysis (top 10)
    const referrerBreakdown = subscriptions
      .filter((sub) => sub.metadata.referer && sub.metadata.referer !== "")
      .reduce(
        (acc, sub) => {
          const referer = sub.metadata.referer || "direct";
          try {
            const url = new URL(referer);
            const domain = url.hostname + url.pathname;
            acc[domain] = (acc[domain] || 0) + 1;
          } catch {
            acc[referer] = (acc[referer] || 0) + 1;
          }
          return acc;
        },
        {} as Record<string, number>,
      );

    const topReferrers = Object.entries(referrerBreakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    // Email provider analysis
    const emailProviders = subscriptions.reduce(
      (acc, sub) => {
        const provider = sub.metadata.emailProvider || "unknown";
        acc[provider] = (acc[provider] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Device/User Agent analysis
    const deviceTypes = subscriptions.reduce(
      (acc, sub) => {
        const userAgent = sub.metadata.userAgent || "";
        if (
          userAgent.includes("Mobile") ||
          userAgent.includes("Android") ||
          userAgent.includes("iPhone")
        ) {
          acc["Mobile"] = (acc["Mobile"] || 0) + 1;
        } else if (userAgent.includes("Tablet") || userAgent.includes("iPad")) {
          acc["Tablet"] = (acc["Tablet"] || 0) + 1;
        } else {
          acc["Desktop"] = (acc["Desktop"] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    // Daily signup trends (last 30 days)
    const dailySignups = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split("T")[0];
      const count = subscriptions.filter((sub) =>
        sub.subscribedAt.startsWith(dateStr),
      ).length;
      return { date: dateStr, count };
    });

    // Geographic analysis (if IP addresses are available)
    const countryEstimates = subscriptions.reduce(
      (acc, sub) => {
        // This is a simplified approach - in production, you'd use a GeoIP service
        const ipAddress = sub.metadata.ipAddress;
        if (ipAddress && ipAddress !== "unknown") {
          // For demo purposes, we'll just group by IP ranges
          // In production, integrate with MaxMind GeoIP or similar
          const ipPrefix = ipAddress.split(".").slice(0, 2).join(".");
          acc[ipPrefix] = (acc[ipPrefix] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    // Email journey health metrics
    const journeyMetrics = {
      // Local storage success rate (assuming all stored means 100% success)
      localStorageSuccessRate: 100, // This would be calculated from logs in production

      // Loops.so sync issues (would need to track failures)
      loopsSyncIssues: 0, // This would be calculated from error logs

      // Rate limiting impact
      rateLimitedRequests: 0, // This would be tracked from middleware logs

      // Form abandonment (would need frontend tracking)
      formStarted: totalSubscriptions, // Simplified - would track form focus events
      formCompleted: totalSubscriptions,
      conversionRate: 100, // Simplified calculation
    };

    // Subscription quality metrics
    const qualityMetrics = {
      hasFirstName: subscriptions.filter(
        (sub) =>
          sub.metadata.signupSource &&
          sub.metadata.signupSource.includes("firstName"),
      ).length,
      hasReferrer: subscriptions.filter(
        (sub) => sub.metadata.referer && sub.metadata.referer !== "",
      ).length,
      organicSignups: subscriptions.filter(
        (sub) =>
          !sub.metadata.referer || !sub.metadata.referer.includes("utm_"), // No UTM parameters = organic
      ).length,
    };

    const analytics = {
      overview: {
        totalSubscriptions,
        activeSubscriptions,
        unsubscribed: totalSubscriptions - activeSubscriptions,
        last30Days,
        last7Days,
        last24Hours,
        growthRate: Math.round(growthRate * 100) / 100,
      },
      trends: {
        dailySignups,
        monthlyGrowthRate: growthRate,
      },
      sources: {
        breakdown: sourceBreakdown,
        topReferrers,
      },
      demographics: {
        emailProviders,
        deviceTypes,
        estimatedRegions: countryEstimates,
      },
      journey: journeyMetrics,
      quality: qualityMetrics,
      generatedAt: now.toISOString(),
      dataFreshness: {
        oldestRecord:
          subscriptions.length > 0
            ? subscriptions.reduce(
                (oldest, sub) =>
                  sub.subscribedAt < oldest ? sub.subscribedAt : oldest,
                subscriptions[0].subscribedAt,
              )
            : null,
        newestRecord:
          subscriptions.length > 0
            ? subscriptions.reduce(
                (newest, sub) =>
                  sub.subscribedAt > newest ? sub.subscribedAt : newest,
                subscriptions[0].subscribedAt,
              )
            : null,
      },
    };

    return NextResponse.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("Analytics retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve analytics" },
      { status: 500 },
    );
  }
}
