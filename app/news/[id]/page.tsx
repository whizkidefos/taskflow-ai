import { Card } from '@/components/ui/card';
import { Calendar, User, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { newsArticles } from '@/lib/mock-data';

interface NewsArticlePageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  return newsArticles.map((article) => ({
    id: article.id,
  }));
}

export default function NewsArticle({ params }: NewsArticlePageProps) {
  const article = newsArticles.find((a) => a.id === params.id);

  if (!article) {
    return (
      <Card className="p-6">
        <div className="text-center text-destructive">
          <h1 className="text-2xl font-bold">Article not found</h1>
          <p className="mt-2">The requested article could not be found.</p>
          <Link href="/" className="mt-4 text-primary hover:underline">
            Return home
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-2xl font-bold mb-4">{article.title}</h1>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={article.date}>
              {new Date(article.date).toLocaleDateString()}
            </time>
          </div>
          <div className="flex items-center gap-1">
            <LinkIcon className="h-4 w-4" />
            <span>{article.source}</span>
          </div>
        </div>

        <div className="mt-4 leading-relaxed">
          {article.content}
        </div>

        <div className="mt-8 pt-4 border-t">
          <Link
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            Read full article
            <LinkIcon className="h-4 w-4" />
          </Link>
        </div>
      </article>
    </Card>
  );
}