'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWeather = async () => {
      try {
        // Get user's location
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
          }
          
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              timeout: 10000,
              enableHighAccuracy: false,
              maximumAge: 300000 // 5 minutes
            }
          );
        });

        const { latitude, longitude } = position.coords;
        
        // Fetch weather data
        const response = await fetch(
          `/api/weather?lat=${latitude}&lon=${longitude}`
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Weather service unavailable');
        }

        const data = await response.json();
        setWeather(data);
        setError(null);
      } catch (err: any) {
        console.error('Weather error:', err);
        if (err.code === 1) {
          setError('Location access denied');
        } else if (err.code === 2) {
          setError('Location unavailable');
        } else if (err.code === 3) {
          setError('Location timeout');
        } else {
          setError(err.message || 'Weather unavailable');
        }
      } finally {
        setLoading(false);
      }
    };

    getWeather();
  }, []);

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading weather...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cloud className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {error}
            </span>
          </div>
        </div>
      </Card>
    );
  }

  if (!weather) {
    return null;
  }

  const WeatherIcon = weather.weather[0].main.toLowerCase().includes('rain')
    ? CloudRain
    : weather.weather[0].main.toLowerCase().includes('cloud')
    ? Cloud
    : Sun;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <WeatherIcon className="h-5 w-5" />
          <span className="font-medium">
            {Math.round(weather.main.temp)}°C
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          {weather.name}
        </span>
      </div>
      <div className="mt-2 text-sm text-muted-foreground">
        {weather.weather[0].description}
      </div>
    </Card>
  );
}