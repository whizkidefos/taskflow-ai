'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md p-6 text-center space-y-6">
        <div className="flex justify-center">
          <WifiOff className="h-16 w-16 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">You&apos;re Offline</h1>
        <p className="text-muted-foreground">
          Please check your internet connection and try again.
        </p>
        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.location.reload()}
          >
            <Wifi className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </Card>
    </div>
  );
}
