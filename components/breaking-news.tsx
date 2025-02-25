'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Newspaper, ExternalLink, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

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

const FALLBACK_NEWS = Array(5).fill(null).map((_, index) => ({
  id: `fallback-${index}`,
  title: 'Welcome to TaskFlow AI - Your Personal Task Management Solution',
  description: 'Stay organized and productive with our advanced features',
  author: 'TaskFlow Team',
  source: { name: 'TaskFlow AI' },
  publishedAt: new Date().toISOString(),
  url: '#'
}));

export function BreakingNews() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
        if (!apiKey) {
          setNews(FALLBACK_NEWS);
          return;
        }

        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&category=technology&pageSize=5&apiKey=${apiKey}`,
          {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'TaskFlow AI/1.0'
            }
          }
        );
        
        if (!response.ok) {
          setNews(FALLBACK_NEWS);
          return;
        }
        
        const data = await response.json();
        
        if (data.status === 'error' || !data.articles?.length) {
          setNews(FALLBACK_NEWS);
          return;
        }

        const formattedNews = data.articles
          .filter((article: any) => article.title && article.url)
          .map((article: any, index: number) => ({
            id: `news-${index}-${Date.now()}`,
            title: article.title,
            description: article.description || '',
            author: article.author || 'Unknown',
            source: article.source || { name: 'Unknown' },
            publishedAt: article.publishedAt,
            url: article.url
          }));

        if (formattedNews.length > 0) {
          setNews(formattedNews);
        } else {
          setNews(FALLBACK_NEWS);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setNews(FALLBACK_NEWS);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Breaking News</h3>
      </div>
      <ScrollArea className="h-[200px] pr-4">
        <div className="space-y-4">
          {news.map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className="font-medium line-clamp-2 hover:text-primary transition-colors">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <span>{article.source.name}</span>
                    <span>•</span>
                    <time>{format(new Date(article.publishedAt), 'MMM d, yyyy')}</time>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              </div>
            </a>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}