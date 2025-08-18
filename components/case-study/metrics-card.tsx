import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Metric {
  label: string;
  value: string;
  description: string;
}

interface MetricsCardProps {
  metric: Metric;
}

export function MetricsCard({ metric }: MetricsCardProps) {
  return (
    <Card
      role="article"
      className="text-center transition-shadow hover:shadow-lg"
    >
      <CardHeader className="pb-2">
        <div className="text-primary text-3xl font-bold md:text-4xl">
          {metric.value}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mb-2 font-semibold">{metric.label}</div>
        <div className="text-muted-foreground text-sm">
          {metric.description}
        </div>
      </CardContent>
    </Card>
  );
}
