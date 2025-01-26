'use client';

import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Newspaper } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  author: string;
  source: {
    name: string;
  };
  publishedAt: string;
  url: string;
}

export function NewsTicker() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&category=technology&pageSize=10&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        
        const data = await response.json();
        
        if (data.status === 'error') {
          throw new Error(data.message || 'Failed to fetch news');
        }

        if (data.articles && Array.isArray(data.articles)) {
          const formattedNews = data.articles
            .filter((article: any) => article.title && article.url)
            .map((article: any, index: number) => ({
              id: index.toString(),
              title: article.title,
              description: article.description || '',
              author: article.author || 'Unknown',
              source: article.source || { name: 'Unknown' },
              publishedAt: article.publishedAt,
              url: article.url
            }));

          setNews(formattedNews);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch news');
      }
    };

    fetchNews();

    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % (news.length || 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-md">
        <Newspaper className="h-4 w-4" />
        <p className="text-sm">Error: {error}</p>
      </div>
    );
  }

  if (!news.length) {
    return null;
  }

  const currentNews = news[currentNewsIndex];

  return (
    <div className="relative overflow-hidden rounded-md news-ticker-bg">
      <div className="flex items-center gap-2 px-4 py-2">
        <Newspaper className="h-4 w-4 flex-shrink-0 text-primary" />
        <ScrollArea className="w-full whitespace-nowrap">
          <a 
            href={currentNews.url}
            target="_blank"
            rel="noopener noreferrer" 
            className="text-sm hover:underline inline-flex items-center gap-2"
          >
            <span className="font-medium">{currentNews.title}</span>
            <span className="text-muted-foreground">
              {currentNews.source.name}
            </span>
          </a>
        </ScrollArea>
      </div>
    </div>
  );
}