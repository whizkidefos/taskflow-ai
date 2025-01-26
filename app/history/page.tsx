'use client';

import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Mock data - replace with real data in production
const historyData = [
  {
    id: '1',
    title: 'Weekly Planning',
    completedAt: new Date(2024, 2, 15),
    items: [
      { text: 'Review goals', completed: true },
      { text: 'Set priorities', completed: true },
    ],
  },
  {
    id: '2',
    title: 'Project Milestones',
    completedAt: new Date(2024, 2, 14),
    items: [
      { text: 'Design review', completed: true },
      { text: 'Client presentation', completed: true },
      { text: 'Team feedback', completed: true },
    ],
  },
  // Add more mock history items
];

export default function History() {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Task History</h1>
        </div>

        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-4">
            {historyData.map((stack) => (
              <Card key={stack.id} className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <h3 className="text-lg font-semibold">{stack.title}</h3>
                  </div>
                  <time className="text-sm text-muted-foreground">
                    {format(stack.completedAt, 'PPP')}
                  </time>
                </div>

                <div className="mt-4 space-y-2">
                  {stack.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-lg border p-2"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="line-through opacity-50">{item.text}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}