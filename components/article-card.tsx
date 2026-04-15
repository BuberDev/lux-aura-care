import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getCategoryById, type Article } from "@/lib/site-data";

type ArticleCardProps = {
  article: Article;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const category = getCategoryById(article.categoryId);

  return (
    <Card className="group overflow-hidden border-white/12 bg-white/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-accent-gold/60">
      <Link href={`/blog/${article.slug}`} className="block">
        <div className="relative h-56 overflow-hidden">
          <Image
            src={article.heroImage}
            alt={article.heroAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/35" />
        </div>

        <div className="space-y-5 p-6">
          <div className="flex flex-wrap items-center gap-2">
            {category ? <Badge>{category.name}</Badge> : null}
            <Badge variant="subtle">{article.pinHook}</Badge>
          </div>

          <h3 className="font-heading text-2xl leading-tight text-text-primary">{article.title}</h3>
          <p className="text-sm leading-relaxed text-text-secondary">{article.excerpt}</p>

          <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.16em] text-text-secondary">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              {article.publishedAt}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 className="size-3.5" aria-hidden="true" />
              {article.readTime}
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
