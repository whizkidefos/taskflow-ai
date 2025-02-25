'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarIcon, Clock, Plus, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { createEvent, getEvents, updateEvent, deleteEvent } from '@/lib/db';
import { toast } from 'sonner';
import { useUser } from '@/lib/hooks/use-user';

interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: 'task' | 'meeting' | 'reminder';
}

interface UpcomingEventsProps {
  initialEvents?: Event[];
}

export function UpcomingEvents({ initialEvents = [] }: UpcomingEventsProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    type: 'task',
  });
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showPastEvents, setShowPastEvents] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Error loading events:', error);
      }
    }

    loadEvents();
  }, []); // Only run on mount

  const currentDate = new Date();
  const upcomingEvents = events.filter((event) => new Date(event.date) >= currentDate);
  const pastEvents = events.filter((event) => new Date(event.date) < currentDate);

  const handleAddEvent = async () => {
    if (!user || !newEvent.title || !newEvent.date || !newEvent.type) return;

    try {
      const result = await createEvent(
        user.id,
        newEvent.title,
        newEvent.date,
        newEvent.type as 'task' | 'meeting' | 'reminder',
        newEvent.time || undefined
      );

      setEvents([...events, result]);
      setShowAddEvent(false);
      setNewEvent({
        title: '',
        date: new Date().toISOString().split('T')[0],
        type: 'task',
      });
      toast.success('Event added successfully');
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to add event');
    }
  };

  const handleEditEvent = async () => {
    if (!user || !editingEvent) return;

    try {
      await updateEvent(
        editingEvent.id,
        editingEvent.title,
        editingEvent.date,
        editingEvent.type,
        editingEvent.time || undefined,
        editingEvent
      );

      setEvents(events.map((e) => (e.id === editingEvent.id ? editingEvent : e)));
      setEditingEvent(null);
      toast.success('Event updated successfully');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      setEvents(events.filter((e) => e.id !== eventId));
      toast.success('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Events</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPastEvents(!showPastEvents)}
          >
            {showPastEvents ? 'Hide Past Events' : 'Show Past Events'}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowAddEvent(true)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {upcomingEvents.length === 0 && (
          <Card className="p-4">
            <p className="text-center text-muted-foreground">No upcoming events</p>
          </Card>
        )}

        {upcomingEvents.map((event) => (
          <Card key={event.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{event.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(event.date), 'PPP')}
                  {event.time && ` at ${event.time}`}
                </p>
                <Badge variant="outline" className="mt-2">
                  {event.type}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingEvent(event)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteEvent(event.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {showPastEvents && pastEvents.length > 0 && (
          <>
            <h3 className="text-lg font-semibold mt-8">Past Events</h3>
            {pastEvents.map((event) => (
              <Card key={event.id} className="p-4 opacity-75">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(event.date), 'PPP')}
                      {event.time && ` at ${event.time}`}
                    </p>
                    <Badge variant="outline" className="mt-2">
                      {event.type}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </>
        )}
      </div>

      <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Event title"
              value={editingEvent?.title || ''}
              onChange={(e) =>
                setEditingEvent((prev) =>
                  prev ? { ...prev, title: e.target.value } : null
                )
              }
            />
            <Input
              type="date"
              value={editingEvent?.date || ''}
              onChange={(e) =>
                setEditingEvent((prev) =>
                  prev ? { ...prev, date: e.target.value } : null
                )
              }
            />
            <Input
              type="time"
              value={editingEvent?.time || ''}
              onChange={(e) =>
                setEditingEvent((prev) =>
                  prev ? { ...prev, time: e.target.value } : null
                )
              }
            />
            <Select
              value={editingEvent?.type || ''}
              onValueChange={(value) =>
                setEditingEvent((prev) =>
                  prev ? { ...prev, type: value as 'task' | 'meeting' | 'reminder' } : null
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="task">Task</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingEvent(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditEvent}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddEvent} onOpenChange={setShowAddEvent}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
                onValueChange={(value: 'task' | 'meeting' | 'reminder') =>
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
                value={newEvent.time || ''}
                onChange={(e) =>
                  setNewEvent((prev) => ({ ...prev, time: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddEvent(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddEvent}
              disabled={!newEvent.title || !newEvent.date || !newEvent.type}
            >
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
