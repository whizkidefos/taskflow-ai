'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarIcon, Clock, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { createEvent, getEvents } from '@/lib/db';
import { toast } from 'sonner';
import { useUser } from '@/lib/hooks/use-user';

interface Event {
  id: string;
  title: string;
  date: string;
  time?: string | null;
  type: 'task' | 'meeting' | 'reminder';
}

interface EventTypeStyles {
  [key: string]: string;
  task: string;
  meeting: string;
  reminder: string;
}

const eventTypeStyles: EventTypeStyles = {
  meeting: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
  task: 'bg-green-500/20 text-green-700 dark:text-green-300',
  reminder: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300',
};

export function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '',
    type: 'task' as Event['type'],
  });

  const fetchEvents = async () => {
    if (!user) return;
    try {
      const data = await getEvents(user.id);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleAddEvent = async () => {
    if (!user) return;
    try {
      await createEvent(
        user.id,
        newEvent.title,
        newEvent.date,
        newEvent.type,
        newEvent.time || undefined
      );
      
      toast.success('Event created successfully');
      
      fetchEvents(); // Refresh the events list
      setNewEvent({
        title: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '',
        type: 'task',
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Upcoming Events</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Plus className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Event title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) =>
                    setNewEvent((prev) => ({ ...prev, date: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newEvent.type}
                  onValueChange={(value: Event['type']) =>
                    setNewEvent((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time (optional)</Label>
                <Input
                  id="time"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) =>
                    setNewEvent((prev) => ({ ...prev, time: e.target.value }))
                  }
                />
              </div>
              <Button
                className="w-full"
                onClick={handleAddEvent}
                disabled={!newEvent.title || !user}
              >
                Add Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="h-[300px] pr-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-muted-foreground">Loading events...</span>
          </div>
        ) : events.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-muted-foreground">No upcoming events</span>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Badge
                  variant="secondary"
                  className={eventTypeStyles[event.type]}
                >
                  {event.type}
                </Badge>
                <div className="flex-1">
                  <h4 className="font-medium">{event.title}</h4>
                  <div className="flex items-center text-sm text-muted-foreground mt-1 space-x-4">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{format(new Date(event.date), 'PPP')}</span>
                    </div>
                    {event.time && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{event.time}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}
