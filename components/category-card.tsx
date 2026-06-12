import Image from "next/image";
import { LocalizedLink } from "@/components/localized-link";

import { Card } from "@/components/ui/card";
import type { Category } from "@/lib/site-data";
import { T } from "@/components/translated-text";

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Card className="group overflow-hidden border-border-subtle bg-surface-subtle transition-all duration-300 hover:-translate-y-1 hover:border-accent-gold/60 hover:bg-surface-raised">
      <LocalizedLink href={`/blog?category=${category.id}`} className="block">
        <div className="relative h-52 overflow-hidden">
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="space-y-3 p-6">
          <h3 className="font-heading text-2xl text-text-primary"><T text={category.name} /></h3>
          <p className="text-sm text-text-secondary"><T text={category.description} /></p>
          <p className="text-xs uppercase tracking-[0.2em] text-accent-gold"><T text={category.heroLine} /></p>
          <p className="pt-1 text-xs uppercase tracking-[0.16em] text-text-secondary"><T text={"Explore top routines"} /></p>
        </div>
      </LocalizedLink>
    </Card>
  );
}
