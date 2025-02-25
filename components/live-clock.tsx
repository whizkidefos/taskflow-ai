'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Home, Globe } from 'lucide-react';
import { DateTime } from 'luxon';

export function LiveClock() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(DateTime.local());
  const [selectedTimeZone, setSelectedTimeZone] = useState<string | null>(null);
  const timeZones = Intl.supportedValuesOf('timeZone');

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTime(DateTime.local());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <Card className="p-6">
        <div className="h-[160px] flex items-center justify-center">
          <span>Loading...</span>
        </div>
      </Card>
    );
  }

  const timeToDisplay = selectedTimeZone
    ? time.setZone(selectedTimeZone)
    : time;

  return (
    <Card className="p-6 transition-all hover:shadow-lg">
      <div className="flex flex-col space-y-6">
        {/* Date */}
        <div className="text-center">
          <h3 className="text-xl font-medium">
            {timeToDisplay.toLocaleString({
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </h3>
        </div>

        {/* Timezone Selection */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSelectedTimeZone(null)}
            title="Local Time"
          >
            <Home className="h-4 w-4" />
          </Button>
          <Select
            value={selectedTimeZone || ''}
            onValueChange={setSelectedTimeZone}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              {timeZones.map((zone) => (
                <SelectItem key={zone} value={zone}>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="truncate">{zone.replace(/_/g, ' ')}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clock */}
        <div className="text-center">
          <div className="font-mono">
            <span className="text-4xl font-bold tabular-nums">
              {timeToDisplay.toFormat('HH:mm:ss')}
            </span>
            <div className="text-sm text-muted-foreground mt-1">
              {selectedTimeZone ? timeToDisplay.zoneName : 'Local Time'}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t text-sm text-muted-foreground">
          <div>
            UTC: {timeToDisplay.toUTC().toFormat('HH:mm:ss')}
          </div>
          <div>
            Offset: {timeToDisplay.toFormat('ZZZZ')}
          </div>
        </div>
      </div>
    </Card>
  );
}