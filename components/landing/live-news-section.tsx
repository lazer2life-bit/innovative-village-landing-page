"use client";

import { useState, useEffect } from "react";
import {
  Newspaper,
  ExternalLink,
  Radio,
  Clock,
  ArrowRight,
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

export function LiveNewsSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => {
        if (data.articles) {
          setArticles(data.articles.slice(0, 6));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="news" className="py-20 lg:py-28 bg-card">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              Live News
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
              <Radio className="h-3 w-3 animate-pulse" />
              LIVE
            </span>
          </div>
          <h2 className="font-display mt-3 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
            Government Finance Updates
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Stay updated with the latest government schemes, rural finance policies,
            budget announcements, and development programs.
          </p>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="mt-14 flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <a
                key={index}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-2xl border border-border bg-background overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg"
              >
                {article.image ? (
                  <div className="relative h-40 w-full overflow-hidden bg-muted">
                    <img
                      src={article.image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="flex h-28 w-full items-center justify-center bg-primary/5">
                    <Newspaper className="h-10 w-10 text-primary/30" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  {article.description && (
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
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
        )}

        {/* CTA */}
        <div className="mt-10 text-center">
          <Button asChild variant="outline" className="gap-2 rounded-full bg-transparent">
            <a href="/auth/login">
              Sign in for full news feed
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
