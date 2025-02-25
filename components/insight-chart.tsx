'use client';

import { Card } from '@/components/ui/card';

interface InsightChartProps {
  data: {
    labels: string[];
    values: number[];
  };
  title: string;
}

export function InsightChart({ data, title }: InsightChartProps) {
  const maxValue = Math.max(...data.values);

  return (
    <Card className="p-4">
      <h3 className="text-sm font-medium mb-4">{title}</h3>
      <div className="space-y-2">
        {data.labels.map((label, index) => (
          <div key={label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{label}</span>
              <span className="text-muted-foreground">{data.values[index]}</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{
                  width: `${(data.values[index] / maxValue) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
