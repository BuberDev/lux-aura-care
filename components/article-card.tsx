import Image from "next/image";
import { LocalizedLink } from "@/components/localized-link";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getCategoryById, type Article } from "@/lib/site-data";
import { T } from "@/components/translated-text";
import { LocalizedDate } from "@/components/localized-date";

type ArticleCardProps = {
  article: Article;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const category = getCategoryById(article.categoryId);

  return (
    <Card className="group overflow-hidden border-border-subtle bg-surface-subtle transition-all duration-300 hover:-translate-y-1 hover:border-accent-gold/60">
      <LocalizedLink href={`/blog/${article.slug}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={article.heroImage}
            alt={article.heroAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        <div className="space-y-5 p-6">
          <div className="flex flex-wrap items-center gap-2">
            {category ? <Badge><T text={category.name} /></Badge> : null}
            <Badge variant="subtle"><T text={"Editorial guide"} /></Badge>
          </div>

          <h3 className="font-heading text-2xl leading-tight text-text-primary"><T text={article.title} /></h3>
          <p className="text-sm leading-relaxed text-text-secondary"><T text={article.excerpt} /></p>
          <p className="text-sm text-text-secondary/90"><T text={article.pinHook} /></p>

          <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.16em] text-text-secondary">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              <LocalizedDate value={article.publishedAt} />
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 className="size-3.5" aria-hidden="true" />
              <T text={article.readTime} />
            </span>
          </div>

          <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.14em] text-accent-gold">
            <T text={"Read guide"} />
            <ArrowRight className="size-4" aria-hidden="true" />
          </p>
        </div>
      </LocalizedLink>
    </Card>
  );
}
