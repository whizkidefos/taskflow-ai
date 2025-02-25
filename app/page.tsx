'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrainCircuit, CheckCircle2, ListTodo, PlusCircle, History, Mail, Github, Chrome, Book, ChevronLeft, ChevronRight } from 'lucide-react';
import { TodoStack } from '@/components/todo-stack';
import { InsightsPanel } from '@/components/insights-panel';
import { CompletedStacks } from '@/components/completed-stacks';
import { WeatherCard } from '@/components/weather-card';
import { LiveClock } from '@/components/live-clock';
import { EventManager } from '@/components/event-manager';
import { ThemeToggle } from '@/components/theme-toggle';
import { SiteFooter } from '@/components/site-footer';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { CalendarView } from '@/components/calendar-view';
import { NewsTicker } from '@/components/news-ticker';

const ITEMS_PER_PAGE = 8;

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newStackName, setNewStackName] = useState('');
  const [stacks, setStacks] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalStacks, setTotalStacks] = useState(0);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          setUser(session?.user ?? null);
          if (event === 'SIGNED_IN') {
            toast.success('Successfully signed in!');
          }
          if (event === 'SIGNED_OUT') {
            toast.success('Successfully signed out!');
          }
        });

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Auth initialization error:', error);
        toast.error('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchStacks();
    }
  }, [user, currentPage]);

  const fetchStacks = async () => {
    try {
      if (!user) return;

      // Get total count
      const { count, error: countError } = await supabase
        .from('todo_stacks')
        .select('*', { count: 'exact', head: true })
        .eq('archived', false)
        .eq('user_id', user.id);

      if (countError) throw countError;
      setTotalStacks(count || 0);

      // Get paginated data
      const { data, error } = await supabase
        .from('todo_stacks')
        .select(`
          id,
          title,
          todo_items (
            id,
            text,
            completed
          )
        `)
        .eq('archived', false)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE - 1);

      if (error) throw error;
      setStacks(data || []);
    } catch (error) {
      console.error('Error fetching stacks:', error);
      toast.error('Failed to load todo stacks');
    }
  };

  const handleCreateStack = async () => {
    if (!newStackName.trim() || !user) return;

    try {
      const { data, error } = await supabase
        .from('todo_stacks')
        .insert([
          { title: newStackName.trim(), user_id: user.id }
        ])
        .select()
        .single();

      if (error) throw error;

      setStacks([{ ...data, todo_items: [] }, ...stacks]);
      setNewStackName('');
      toast.success('Stack created successfully');
    } catch (error) {
      console.error('Error creating stack:', error);
      toast.error('Failed to create stack');
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Failed to sign in with email');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      toast.success('Check your email to complete sign up!');
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Failed to sign up with email');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'github' | 'google') => {
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || `Failed to sign in with ${provider}`);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message || 'Failed to sign out');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-200 h-10 w-10"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-200 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="h-8 w-8 text-primary" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="512" height="512" rx="128" className="fill-background"/>
                <path d="M384 192C384 279.529 312.901 352 224 352C135.099 352 64 279.529 64 192C64 104.471 135.099 32 224 32C312.901 32 384 104.471 384 192Z" className="fill-primary"/>
                <path d="M448 320C448 407.529 376.901 480 288 480C199.099 480 128 407.529 128 320C128 232.471 199.099 160 288 160C376.901 160 448 232.471 448 320Z" className="fill-primary/50"/>
                <path d="M224 288C277.019 288 320 245.019 320 192C320 138.981 277.019 96 224 96C170.981 96 128 138.981 128 192C128 245.019 170.981 288 224 288Z" className="fill-background"/>
                <path d="M288 416C341.019 416 384 373.019 384 320C384 266.981 341.019 224 288 224C234.981 224 192 266.981 192 320C192 373.019 234.981 416 288 416Z" className="fill-background"/>
              </svg>
              <h1 className="text-2xl font-bold">TaskFlow AI</h1>
              <NewsTicker />
            </div>
            <ThemeToggle />
          </div>
          
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="oauth">Social</TabsTrigger>
            </TabsList>
            
            <TabsContent value="email" className="space-y-4">
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Button 
                    type="submit"
                    className="w-full"
                    disabled={authLoading}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleEmailSignUp}
                    disabled={authLoading}
                  >
                    Create Account
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="oauth" className="space-y-4">
              <Button 
                className="w-full"
                onClick={() => handleOAuthSignIn('github')}
                disabled={authLoading}
              >
                <Github className="mr-2 h-4 w-4" />
                Continue with GitHub
              </Button>

              <Button 
                className="w-full"
                variant="outline"
                onClick={() => handleOAuthSignIn('google')}
                disabled={authLoading}
              >
                <Chrome className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>
            </TabsContent>
          </Tabs>

          <div className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </div>
        </Card>
      </div>
    );
  }

  const totalPages = Math.ceil(totalStacks / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="h-8 w-8 text-primary" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="512" height="512" rx="128" className="fill-background"/>
                  <path d="M384 192C384 279.529 312.901 352 224 352C135.099 352 64 279.529 64 192C64 104.471 135.099 32 224 32C312.901 32 384 104.471 384 192Z" className="fill-primary"/>
                  <path d="M448 320C448 407.529 376.901 480 288 480C199.099 480 128 407.529 128 320C128 232.471 199.099 160 288 160C376.901 160 448 232.471 448 320Z" className="fill-primary/50"/>
                  <path d="M224 288C277.019 288 320 245.019 320 192C320 138.981 277.019 96 224 96C170.981 96 128 138.981 128 192C128 245.019 170.981 288 224 288Z" className="fill-background"/>
                  <path d="M288 416C341.019 416 384 373.019 384 320C384 266.981 341.019 224 288 224C234.981 224 192 266.981 192 320C192 373.019 234.981 416 288 416Z" className="fill-background"/>
                </svg>
                <h1 className="text-2xl font-bold hidden md:block">TaskFlow AI</h1>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/docs">
                  <Button variant="outline" size="icon" title="Documentation">
                    <Book className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/history">
                  <Button variant="outline" size="icon" title="View History">
                    <History className="h-5 w-5" />
                  </Button>
                </Link>
                <ThemeToggle />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleSignOut}
                >
                  Sign out
                </Button>
              </div>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <Tabs defaultValue="current" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="current" className="flex items-center gap-2">
                      <ListTodo className="h-4 w-4" />
                      Current Stacks
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Completed
                    </TabsTrigger>
                    <TabsTrigger value="insights" className="flex items-center gap-2">
                      <BrainCircuit className="h-4 w-4" />
                      Insights
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="current" className="space-y-4">
                    <Card className="p-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="New stack name..."
                          value={newStackName}
                          onChange={(e) => setNewStackName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCreateStack();
                          }}
                          className="max-w-sm"
                        />
                        <Button onClick={handleCreateStack}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Create Stack
                        </Button>
                      </div>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-2">
                      {stacks.map((stack) => (
                        <TodoStack
                          key={stack.id}
                          id={stack.id}
                          title={stack.title}
                          items={stack.todo_items}
                          onUpdate={fetchStacks}
                        />
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-4 mt-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                          disabled={currentPage === 0}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          Page {currentPage + 1} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                          disabled={currentPage === totalPages - 1}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="completed">
                    <CompletedStacks />
                  </TabsContent>

                  <TabsContent value="insights">
                    <InsightsPanel />
                  </TabsContent>
                </Tabs>
                <div className="mt-4">
                  <CalendarView />
                </div>
              </div>

              <div className="space-y-4 w-full">
                <WeatherCard />
                <LiveClock />
                <EventManager />
              </div>
            </div>
          </header>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}