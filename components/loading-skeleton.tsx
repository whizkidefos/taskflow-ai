'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function LoadingSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Header Area */}
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-8" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Tasks Area */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Weather Card */}
          <Card className="p-4">
            <Skeleton className="h-24 w-full" />
          </Card>

          {/* Calendar */}
          <Card className="p-4">
            <Skeleton className="h-64 w-full" />
          </Card>
        </div>
      </div>
    </div>
  );
}
