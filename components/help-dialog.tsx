'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';

export function HelpDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [docs, setDocs] = useState('');

  useEffect(() => {
    fetch('/docs/README.md')
      .then((res) => res.text())
      .then(setDocs)
      .catch(console.error);
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-4 right-4 rounded-full"
        onClick={() => setIsOpen(true)}
      >
        <HelpCircle className="h-6 w-6" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>TaskFlow AI Documentation</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <ScrollArea className="h-[calc(80vh-100px)] pr-4">
            <div className="prose prose-sm dark:prose-invert">
              <ReactMarkdown>{docs}</ReactMarkdown>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
