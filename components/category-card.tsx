import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { Category } from "@/lib/site-data";

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Card className="group overflow-hidden border-white/12 bg-white/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-accent-gold/60 hover:bg-white/[0.04]">
      <Link href={`/blog?category=${category.id}`} className="block">
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
          <h3 className="font-heading text-2xl text-text-primary">{category.name}</h3>
          <p className="text-sm text-text-secondary">{category.description}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-accent-gold">{category.heroLine}</p>
        </div>
      </Link>
    </Card>
  );
}
