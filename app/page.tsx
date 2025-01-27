'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrainCircuit, CheckCircle2, ListTodo, PlusCircle, History } from 'lucide-react';
import { TodoStack } from '@/components/todo-stack';
import { CreateStack } from '@/components/create-stack';
import { InsightsPanel } from '@/components/insights-panel';
import { CompletedStacks } from '@/components/completed-stacks';
import { WeatherCard } from '@/components/weather-card';
import { LiveClock } from '@/components/live-clock';
import { ThemeToggle } from '@/components/theme-toggle';
import { SiteFooter } from '@/components/site-footer';
import { TopJobs } from '@/components/top-jobs';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useUser } from '@/lib/hooks/use-user';
import { useLoading } from '@/lib/hooks/use-loading';
import { Calendar } from '@/components/calendar/calendar';
import { UpcomingEvents } from '@/components/calendar/events';
import { getStacks } from '@/lib/db';
import { InsightChart } from '@/components/insight-chart';
import { Logo } from '@/components/logo';
import { LoadingSkeleton } from '@/components/loading-skeleton';

export default function Home() {
  const { user, loading: userLoading } = useUser();
  const { isLoading, setIsLoading } = useLoading();
  const [authLoading, setAuthLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [stacks, setStacks] = useState<any[]>([]);

  const fetchStacks = async () => {
    if (!user) return;
    try {
      const data = await getStacks(user.id);
      setStacks(data || []);
    } catch (error) {
      console.error('Error fetching stacks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStacks();
    } else {
      setIsLoading(false);
    }
  }, [user, fetchStacks, setIsLoading]);

  // Show loading skeleton for the main app
  if ((userLoading || isLoading) && user) {
    return <LoadingSkeleton />;
  }

  // Show loading spinner for auth
  if (userLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-[100vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[100vh] bg-background">
        <div className="w-full max-w-md p-4 space-y-8">
          <div className="flex justify-center">
            <Logo />
          </div>
          <Card className="p-8 space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold">Welcome Back</h1>
              <p className="text-muted-foreground">
                {isSignUp ? 'Create an account to get started' : 'Sign in to your account'}
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                onClick={() => handleAuth()}
                disabled={authLoading || !email || !password}
              >
                {authLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span>{isSignUp ? 'Sign Up' : 'Sign In'}</span>
                  </div>
                ) : (
                  isSignUp ? 'Sign Up' : 'Sign In'
                )}
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setAuthLoading(false);
              }}
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const handleAuth = async () => {
    try {
      setAuthLoading(true);
      let result;
      
      if (isSignUp) {
        result = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });
        if (result.error) throw result.error;
        toast.success('Check your email to confirm your account!');
      } else {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (result.error) throw result.error;
        toast.success('Successfully signed in!');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <BrainCircuit className="h-8 w-8" />
            <h1 className="text-2xl font-bold">TaskFlow AI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              onClick={() => supabase.auth.signOut()}
            >
              Sign Out
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="active" className="space-y-4">
              <TabsList>
                <TabsTrigger value="active">
                  <ListTodo className="h-4 w-4 mr-2" />
                  Active
                </TabsTrigger>
                <TabsTrigger value="completed">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Completed
                </TabsTrigger>
                <TabsTrigger value="history">
                  <History className="h-4 w-4 mr-2" />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                <CreateStack onStackCreated={fetchStacks} />
                <ScrollArea className="h-[calc(100vh-24rem)]">
                  <div className="grid gap-4 md:grid-cols-2">
                    {stacks.map((stack) => (
                      <TodoStack
                        key={stack.id}
                        id={stack.id}
                        title={stack.title}
                        tasks={stack.tasks}
                        onUpdate={fetchStacks}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="completed">
                <CompletedStacks />
              </TabsContent>

              <TabsContent value="history">
                <Card className="p-4">
                  <h2 className="text-lg font-semibold mb-4">Task History</h2>
                  {/* Add task history component here */}
                </Card>
              </TabsContent>
            </Tabs>

            {/* Add Insight Chart */}
            <div className="mt-6">
              <InsightChart />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 mb-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <WeatherCard />
                <LiveClock />
              </div>
              <Card className="p-4">
                <Calendar 
                  mode="single"
                  selected={selectedDate || undefined}
                  onSelect={(date) => setSelectedDate(date || null)}
                  className="w-full"
                />
              </Card>
              <UpcomingEvents />
            </div>
          </div>
        </div>

        <SiteFooter />
      </div>
    </div>
  );
}