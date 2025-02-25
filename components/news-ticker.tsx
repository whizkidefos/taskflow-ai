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

const FALLBACK_NEWS = [{
  id: '1',
  title: 'Welcome to TaskFlow AI - Your Personal Task Management Solution',
  description: 'Stay organized and productive with our advanced features',
  author: 'TaskFlow Team',
  source: { name: 'TaskFlow AI' },
  publishedAt: new Date().toISOString(),
  url: '#'
}];

export function NewsTicker() {
  const [news, setNews] = useState<NewsArticle[]>(FALLBACK_NEWS);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
        if (!apiKey) {
          return;
        }

        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&category=technology&pageSize=10&apiKey=${apiKey}`,
          {
            headers: {
              'X-Api-Key': apiKey,
              'Accept': 'application/json'
            },
            cache: 'no-cache'
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'error' || !data.articles?.length) {
          return;
        }

        const formattedNews = data.articles
          .filter((article: any) => article.title && article.url)
          .map((article: any, index: number) => ({
            id: `news-${index}`,
            title: article.title.replace(/\[\+\d+ chars\]$/, '').trim(),
            description: article.description || '',
            author: article.author || 'Unknown',
            source: article.source || { name: 'Unknown' },
            publishedAt: article.publishedAt,
            url: article.url
          }));

        if (formattedNews.length > 0) {
          setNews(formattedNews);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();

    const newsInterval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % news.length);
    }, 5000);

    const fetchInterval = setInterval(fetchNews, 300000); // Refresh every 5 minutes

    return () => {
      clearInterval(newsInterval);
      clearInterval(fetchInterval);
    };
  }, [news.length]);

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