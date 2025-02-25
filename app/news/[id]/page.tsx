'use client';

import { Card } from '@/components/ui/card';
import { Calendar, User, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

// Move the mock data inside the component
export default function NewsArticle({ params }: { params: { id: string } }) {
  const newsArticles = [
    {
      id: '1',
      title: 'Major tech companies announce new AI initiatives',
      content: 'Several leading technology companies have announced significant investments in artificial intelligence research and development...',
      author: 'John Smith',
      source: 'Tech Daily',
      date: '2024-03-20',
      url: 'https://example.com/news/1'
    },
    {
      id: '2',
      title: 'Global climate summit concludes with new agreements',
      content: 'World leaders have reached a consensus on new climate action targets during the latest international summit...',
      author: 'Sarah Johnson',
      source: 'Global News',
      date: '2024-03-19',
      url: 'https://example.com/news/2'
    },
    {
      id: '3',
      title: 'Scientists make breakthrough in quantum computing research',
      content: 'Researchers have achieved a significant milestone in quantum computing, demonstrating new capabilities...',
      author: 'David Chen',
      source: 'Science Today',
      date: '2024-03-18',
      url: 'https://example.com/news/3'
    },
    {
      id: '4',
      title: 'Space agency reveals plans for next Mars mission',
      content: 'The space agency has announced ambitious plans for their upcoming Mars exploration mission...',
      author: 'Emily Rodriguez',
      source: 'Space Weekly',
      date: '2024-03-17',
      url: 'https://example.com/news/4'
    }
  ];

  const article = newsArticles.find(a => a.id === params.id);

  if (!article) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <Link href="/" className="text-primary hover:underline">
            Return to home
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6">
        <Link href="/" className="text-primary hover:underline mb-4 inline-block">
          ← Back to home
        </Link>

        <article className="space-y-6">
          <h1 className="text-3xl font-bold">{article.title}</h1>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time>{new Date(article.date).toLocaleDateString()}</time>
            </div>
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              <span>{article.source}</span>
            </div>
          </div>

          <div className="prose dark:prose-invert">
            <p>{article.content}</p>
          </div>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-primary hover:underline"
          >
            Read full article →
          </a>
        </article>
      </Card>
    </div>
  );
}