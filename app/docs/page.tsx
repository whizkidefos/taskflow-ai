'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Book, CheckCircle2, Archive, Trash2, RefreshCcw } from 'lucide-react';

export default function Documentation() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Book className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Documentation</h1>
          </div>
        </div>

        <div className="space-y-8">
          {/* Getting Started */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <Card className="p-6 space-y-4">
              <p>
                TaskFlow AI is a powerful task management application that helps you organize your work
                efficiently. Here's how to get started:
              </p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Sign in using your email or social accounts</li>
                <li>Create a new stack by entering a name and pressing Enter</li>
                <li>Add tasks to your stack</li>
                <li>Start managing your work!</li>
              </ol>
            </Card>
          </section>

          {/* Features */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Task Management</h3>
                </div>
                <p className="text-muted-foreground">
                  Create task stacks, add items, and mark them as complete. Tasks are automatically
                  organized and tracked.
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Archive className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Archiving</h3>
                </div>
                <p className="text-muted-foreground">
                  Archive completed stacks to keep your workspace clean. Access them anytime in the
                  Completed tab.
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCcw className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Stack Actions</h3>
                </div>
                <p className="text-muted-foreground">
                  Restore archived stacks if needed, or delete them permanently when they're no longer
                  required.
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Trash2 className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Cleanup</h3>
                </div>
                <p className="text-muted-foreground">
                  Keep your workspace organized by managing archived stacks. Delete completed tasks
                  when they're no longer needed.
                </p>
              </Card>
            </div>
          </section>

          {/* Usage Guide */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Usage Guide</h2>
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Creating Stacks</h3>
                  <p className="text-muted-foreground">
                    Enter a name for your new stack in the input field and press Enter or click the
                    Create Stack button. Each stack can contain multiple tasks.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Managing Tasks</h3>
                  <p className="text-muted-foreground">
                    Add tasks to your stack using the input field. Mark tasks as complete by clicking
                    the checkbox. When all tasks in a stack are completed, it will be automatically
                    archived.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Archiving and Restoration</h3>
                  <p className="text-muted-foreground">
                    Manually archive stacks using the archive button, or let them auto-archive when
                    completed. Find archived stacks in the Completed tab, where you can restore or
                    delete them.
                  </p>
                </div>
              </div>
            </Card>
          </section>

          {/* Tips and Best Practices */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Tips and Best Practices</h2>
            <Card className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <span>Create focused stacks for specific projects or categories</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <span>Regularly archive completed stacks to maintain a clean workspace</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <span>Use clear and actionable task descriptions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <span>Review completed stacks periodically for insights into your productivity</span>
                </li>
              </ul>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}