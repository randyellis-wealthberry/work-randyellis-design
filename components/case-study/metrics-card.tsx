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
      className="text-center hover:shadow-lg transition-shadow"
    >
      <CardHeader className="pb-2">
        <div className="text-3xl md:text-4xl font-bold text-primary">
          {metric.value}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="font-semibold mb-2">{metric.label}</div>
        <div className="text-sm text-muted-foreground">
          {metric.description}
        </div>
      </CardContent>
    </Card>
  );
}
