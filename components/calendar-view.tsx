'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  CalendarDays
} from 'lucide-react';
import { format, isSameDay, parseISO } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
}

export function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'month' | 'day'>('month');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setEvents([]);
        return;
      }

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      console.error('Error fetching events:', error);
      toast.error(error.message || 'Failed to load events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const getDayEvents = (day: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), day))
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (!date) return;
    const newDate = new Date(date);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setDate(newDate);
  };

  const toggleView = () => {
    setView(view === 'month' ? 'day' : 'month');
  };

  const renderEventBadge = (count: number) => {
    if (count === 0) return null;
    return (
      <Badge
        variant="secondary"
        className="absolute bottom-0 right-0 transform translate-x-1/3 translate-y-1/3 text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-primary text-primary-foreground"
      >
        {count}
      </Badge>
    );
  };

  return (
    <Card className="p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Calendar</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleView}
            className="hidden sm:flex"
            title={view === 'month' ? 'Switch to day view' : 'Switch to month view'}
          >
            {view === 'month' ? (
              <CalendarDays className="h-4 w-4" />
            ) : (
              <Calendar className="h-4 w-4" />
            )}
          </Button>
          <div className="flex items-center rounded-md border bg-muted/50">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth('prev')}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-2 min-w-[120px] text-center">
              {date ? format(date, 'MMMM yyyy') : ''}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth('next')}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[3fr,1fr] md:grid-cols-[2fr,1fr]">
        <div className="w-full">
          <div className="rounded-md border bg-card p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="w-full"
              modifiers={{
                today: new Date(),
                hasEvents: (date) => events.some(event => isSameDay(new Date(event.date), date)),
              }}
              modifiersStyles={{
                today: {
                  fontWeight: 'bold',
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                },
                hasEvents: {
                  border: '2px solid hsl(var(--primary))',
                }
              }}
              components={{
                DayContent: ({ date }) => {
                  const dayEvents = getDayEvents(date);
                  return (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <span>{format(date, 'd')}</span>
                      {renderEventBadge(dayEvents.length)}
                    </div>
                  );
                },
              }}
            />
          </div>
        </div>

        {date && (
          <Card className="p-4 bg-muted/10">
            <h4 className="font-medium text-sm flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-primary" />
              Events for {format(date, 'MMMM d, yyyy')}
            </h4>
            <ScrollArea className="h-[300px] pr-4">
              {getDayEvents(date).length > 0 ? (
                <div className="space-y-2">
                  {getDayEvents(date).map((event) => (
                    <div
                      key={event.id}
                      className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium">{event.title}</span>
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          {event.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <CalendarDays className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">No events scheduled for this day</p>
                </div>
              )}
            </ScrollArea>
          </Card>
        )}
      </div>
    </Card>
  );
}