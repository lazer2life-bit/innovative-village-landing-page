"use client";

import { useState, useEffect } from "react";
import {
  Newspaper,
  ExternalLink,
  RefreshCw,
  Loader2,
  Radio,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diff = now.getTime() - then.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function LiveNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchNews() {
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      if (data.articles) {
        setArticles(data.articles);
      }
    } catch {
      // Keep existing articles on error
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchNews().finally(() => setLoading(false));

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchNews();
    }, 300000);
    return () => clearInterval(interval);
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    await fetchNews();
    setRefreshing(false);
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Live Government Finance News
            </h2>
            <span className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
              <Radio className="h-3 w-3 animate-pulse" />
              LIVE
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Latest government schemes, budgets, and rural finance updates from India.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="gap-2 rounded-full bg-transparent"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* News Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {articles.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <Newspaper className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-muted-foreground">
              No news articles available at the moment. Try refreshing.
            </p>
          </div>
        )}
        {articles.map((article, index) => (
          <a
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-md"
          >
            {/* Image */}
            {article.image && (
              <div className="relative h-40 w-full overflow-hidden bg-muted">
                <img
                  src={article.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            )}
            {!article.image && (
              <div className="flex h-28 w-full items-center justify-center bg-primary/5">
                <Newspaper className="h-10 w-10 text-primary/30" />
              </div>
            )}

            {/* Content */}
            <div className="flex flex-1 flex-col p-4">
              <h3 className="font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              {article.description && (
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {article.description}
                </p>
              )}
              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-primary/80">
                    {article.source.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {timeAgo(article.publishedAt)}
                  </span>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
