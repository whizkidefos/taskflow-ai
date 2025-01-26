'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

export function LiveClock() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <Card className="p-6">
        <div className="h-[180px] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading...
          </motion.div>
        </div>
      </Card>
    );
  }

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();

  // Calculate smooth angles for clock hands
  const secondAngle = ((seconds + milliseconds / 1000) / 60) * 360;
  const minuteAngle = ((minutes + seconds / 60) / 60) * 360;
  const hourAngle = ((hours % 12 + minutes / 60) / 12) * 360;

  const timeString = time.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: !is24Hour,
  });

  const dateString = time.toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card className="p-6 transition-all hover:shadow-lg dark:hover:shadow-primary/10">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-40 h-40">
          {/* Clock face */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/20">
            {/* Hour numbers */}
            {[...Array(12)].map((_, i) => {
              const angle = ((i + 1) * 30 * Math.PI) / 180;
              const x = Math.sin(angle) * 52;
              const y = -Math.cos(angle) * 52;
              return (
                <div
                  key={i}
                  className="absolute text-sm font-medium text-primary/80"
                  style={{
                    transform: `translate(-50%, -50%)`,
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                  }}
                >
                  {i + 1}
                </div>
              );
            })}

            {/* Hour markers */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-3 bg-primary/60"
                style={{
                  transform: `rotate(${i * 30}deg) translateY(2px)`,
                  transformOrigin: '50% 100%',
                  left: '50%',
                  top: '0',
                }}
              />
            ))}
          </div>

          {/* Hour hand */}
          <motion.div
            className="absolute w-1.5 h-16 bg-primary rounded-full"
            style={{
              transformOrigin: 'bottom center',
              left: 'calc(50% - 0.75px)',
              bottom: '50%',
            }}
            animate={{ rotate: hourAngle }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          />

          {/* Minute hand */}
          <motion.div
            className="absolute w-1 h-20 bg-primary/80 rounded-full"
            style={{
              transformOrigin: 'bottom center',
              left: 'calc(50% - 0.5px)',
              bottom: '50%',
            }}
            animate={{ rotate: minuteAngle }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          />

          {/* Second hand */}
          <motion.div
            className="absolute w-0.5 h-20 bg-red-500 rounded-full"
            style={{
              transformOrigin: 'bottom center',
              left: 'calc(50% - 0.25px)',
              bottom: '50%',
            }}
            animate={{ rotate: secondAngle }}
            transition={{ type: 'tween', duration: 0.1, ease: 'linear' }}
          />

          {/* Center dot */}
          <div className="absolute w-3 h-3 bg-primary rounded-full" style={{ left: 'calc(50% - 6px)', top: 'calc(50% - 6px)' }} />
        </div>

        <div className="text-center space-y-2">
          <motion.h2
            className="text-xl font-bold tabular-nums"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {timeString}
          </motion.h2>
          <motion.p
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {dateString}
          </motion.p>
          <button
            onClick={() => setIs24Hour(!is24Hour)}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Toggle 24h format
          </button>
        </div>
      </div>
    </Card>
  );
}