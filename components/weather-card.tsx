'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind, Loader2, CloudDrizzle, CloudFog } from 'lucide-react';

interface WeatherData {
  temp: number;
  feels_like: number;
  condition: string;
  location: string;
  humidity: number;
  wind_speed: number;
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

        // Fetch weather data from OpenWeatherMap API
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
        );

        if (!response.ok) throw new Error('Weather data not available');

        const data = await response.json();

        setWeather({
          temp: Math.round(data.main.temp),
          feels_like: Math.round(data.main.feels_like),
          condition: data.weather[0].main,
          location: data.name,
          humidity: data.main.humidity,
          wind_speed: Math.round(data.wind.speed * 3.6) // Convert m/s to km/h
        });
      } catch (err) {
        setError('Could not fetch weather data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getWeather();
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="h-12 w-12 text-yellow-500" />;
      case 'rain':
        return <CloudRain className="h-12 w-12 text-blue-500" />;
      case 'drizzle':
        return <CloudDrizzle className="h-12 w-12 text-blue-400" />;
      case 'snow':
        return <CloudSnow className="h-12 w-12 text-blue-200" />;
      case 'thunderstorm':
        return <CloudLightning className="h-12 w-12 text-yellow-600" />;
      case 'mist':
      case 'fog':
        return <CloudFog className="h-12 w-12 text-gray-400" />;
      default:
        return <Cloud className="h-12 w-12 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-[120px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-destructive">
          <p className="font-medium">{error}</p>
          <p className="text-sm mt-1">Please enable location services and try again</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 transition-all hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium text-muted-foreground mb-1">
            {weather?.location}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold">{weather?.temp}°C</span>
            <div className="text-sm text-muted-foreground">
              <p>Feels like {weather?.feels_like}°C</p>
              <p>{weather?.condition}</p>
            </div>
          </div>
        </div>
        {weather && getWeatherIcon(weather.condition)}
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t">
        <div className="flex items-center gap-2">
          <Wind className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {weather?.wind_speed} km/h
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CloudRain className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {weather?.humidity}%
          </span>
        </div>
      </div>
    </Card>
  );
}