'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, Trash2, Plus, Edit2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  user_id: string;
}

export function EventManager() {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '' });
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...newEvent,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setEvents([...events, data]);
      setNewEvent({ title: '', date: '', time: '' });
      toast.success('Event added successfully');
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to add event');
    }
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('events')
        .update(editingEvent)
        .eq('id', editingEvent.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setEvents(events.map(event => 
        event.id === editingEvent.id ? editingEvent : event
      ));
      setEditingEvent(null);
      toast.success('Event updated successfully');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setEvents(events.filter(event => event.id !== id));
      toast.success('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Event Manager</h3>
      
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Event title"
            value={editingEvent ? editingEvent.title : newEvent.title}
            onChange={(e) => editingEvent 
              ? setEditingEvent({ ...editingEvent, title: e.target.value })
              : setNewEvent({ ...newEvent, title: e.target.value })
            }
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="date"
                value={editingEvent ? editingEvent.date : newEvent.date}
                onChange={(e) => editingEvent
                  ? setEditingEvent({ ...editingEvent, date: e.target.value })
                  : setNewEvent({ ...newEvent, date: e.target.value })
                }
              />
            </div>
            <div className="flex-1">
              <Input
                type="time"
                value={editingEvent ? editingEvent.time : newEvent.time}
                onChange={(e) => editingEvent
                  ? setEditingEvent({ ...editingEvent, time: e.target.value })
                  : setNewEvent({ ...newEvent, time: e.target.value })
                }
              />
            </div>
          </div>
          <Button 
            onClick={editingEvent ? handleUpdateEvent : handleAddEvent}
            className="w-full"
          >
            {editingEvent ? 'Update Event' : 'Add Event'}
          </Button>
        </div>

        <div className="space-y-2">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-2 rounded-lg border bg-card"
            >
              <div className="flex-1">
                <h4 className="font-medium">{event.title}</h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(event.date), 'MMM d, yyyy')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {event.time}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingEvent(event)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteEvent(event.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}