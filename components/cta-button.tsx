import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type CTAButtonProps = {
  href: string;
  label: string;
  variant?: "default" | "secondary" | "ghost";
  className?: string;
};

export function CTAButton({ href, label, variant = "default", className }: CTAButtonProps) {
  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <Button asChild size="lg" variant={variant} className={className}>
        <a href={href} target="_blank" rel="noopener noreferrer sponsored">
          {label}
          <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
        </a>
      </Button>
    );
  }

  return (
    <Button asChild size="lg" variant={variant} className={className}>
      <Link href={href}>
        {label}
        <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
      </Link>
    </Button>
  );
}
