'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface NewsArticle {
  title: string;
  url: string;
  source: {
    name: string;
  };
}

export function NewsTicker() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch news');
        }
        
        const data = await response.json();
        
        if (data.status === 'error') {
          throw new Error(data.message || 'Failed to fetch news');
        }

        if (data.articles && Array.isArray(data.articles)) {
          const formattedNews = data.articles
            .filter((article: NewsArticle) => article.title && article.url)
            .map((article: NewsArticle) => ({
              title: article.title,
              url: article.url,
              source: article.source
            }));
          setNews(formattedNews);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch news');
        console.error('News error:', err);
      }
    };

    fetchNews();
  }, []); // Only run on mount

  useEffect(() => {
    if (news.length === 0) return;

    const interval = setInterval(() => {
      setCurrentNewsIndex((prevIndex) => 
        prevIndex === news.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [news.length]);

  if (error || news.length === 0) {
    return null;
  }

  return (
    <div className="relative overflow-hidden h-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentNewsIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center space-x-2 text-sm text-muted-foreground"
        >
          <ChevronRight className="h-4 w-4" />
          <a
            href={news[currentNewsIndex].url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            {news[currentNewsIndex].title}
            <span className="ml-2 text-xs opacity-70 text-muted-foreground text-primary">
              - {news[currentNewsIndex].source.name}
            </span>
          </a>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}