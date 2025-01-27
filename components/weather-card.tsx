'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Cloud, CloudRain, Sun, Loader2 } from 'lucide-react';

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  name: string;
}

export function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getWeather = async () => {
      try {
        // Get user's location
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;

        // Fetch weather data from our API route
        const response = await fetch(
          `/api/weather?lat=${latitude}&lon=${longitude}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Weather data not available');
        }

        const data = await response.json();

        setWeather({
          main: {
            temp: Math.round(data.main.temp),
            humidity: data.main.humidity,
          },
          weather: data.weather,
          name: data.name,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather');
        console.error('Weather error:', err);
      } finally {
        setLoading(false);
      }
    };

    getWeather();
  }, []); // Only run on mount

  const WeatherIcon = () => {
    if (!weather?.weather[0]?.main) return <Cloud className="h-6 w-6" />;
    
    switch (weather.weather[0].main.toLowerCase()) {
      case 'clear':
        return <Sun className="h-6 w-6" />;
      case 'rain':
        return <CloudRain className="h-6 w-6" />;
      default:
        return <Cloud className="h-6 w-6" />;
    }
  };

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[70px]" />
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <div className="flex items-center space-x-2 text-destructive">
          <Cloud className="h-6 w-6" />
          <p className="text-sm">Weather unavailable</p>
        </div>
      </Card>
    );
  }

  if (!weather) return null;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-primary">
            <WeatherIcon />
          </div>
          <div>
            <p className="font-medium">{weather.name}</p>
            <p className="text-sm text-muted-foreground">
              {weather.weather[0]?.description}
            </p>
          </div>
        </div>
        <p className="text-2xl font-bold">{weather.main.temp}°C</p>
      </div>
    </Card>
  );
}