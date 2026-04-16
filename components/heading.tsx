import { cn } from "@/lib/utils";

type HeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function Heading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: HeadingProps) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow ? (
        <p className="mb-3 text-xs uppercase tracking-[0.22em] text-accent-gold">{eyebrow}</p>
      ) : null}
      <h2 className="max-w-4xl font-heading text-3xl leading-[1.15] text-text-primary sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-text-secondary md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
