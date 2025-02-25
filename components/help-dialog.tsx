'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { HelpCircle } from 'lucide-react';

export function HelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-primary">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">TaskFlow AI Documentation</DialogTitle>
          <DialogDescription className="space-y-6">
            <div className="prose prose-slate dark:prose-invert">
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
                <p className="mb-4">
                  TaskFlow AI is your intelligent productivity companion, designed to help you manage tasks, track events, and boost your productivity.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Key Features</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Task Management:</strong> Create and organize tasks in stacks</li>
                  <li><strong>Stack Actions:</strong> Complete or archive stacks when you're done</li>
                  <li><strong>Calendar Integration:</strong> Track events and deadlines</li>
                  <li><strong>Job Board:</strong> Browse relevant job opportunities</li>
                  <li><strong>News Updates:</strong> Stay informed with the latest news</li>
                  <li><strong>Weather Info:</strong> Check current weather conditions</li>
                  <li><strong>Dark Mode:</strong> Toggle between light and dark themes</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Using Task Stacks</h2>
                <div className="space-y-4">
                  <p><strong>Creating a Stack:</strong> Click the "Create Stack" button and enter a title.</p>
                  <p><strong>Adding Tasks:</strong> Use the input field at the bottom of each stack to add new tasks.</p>
                  <p><strong>Completing Tasks:</strong> Click the checkbox next to a task to mark it as complete.</p>
                  <p><strong>Stack Actions:</strong></p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Click the checkmark icon to mark the entire stack as completed</li>
                    <li>Use the archive icon to archive a stack you no longer need</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Tips & Tricks</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the calendar to plan your tasks and events</li>
                  <li>Check the Insights tab to track your productivity</li>
                  <li>Archive stacks to keep your workspace clean</li>
                  <li>Use dark mode for comfortable night-time viewing</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
                <p>
                  If you have any questions or need assistance, please don't hesitate to reach out to our support team.
                </p>
              </section>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
