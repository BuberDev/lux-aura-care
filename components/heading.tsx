import { cn } from "@/lib/utils";
import { T } from "@/components/translated-text";

type HeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  level?: "h1" | "h2";
  className?: string;
};

export function Heading({
  eyebrow,
  title,
  description,
  align = "left",
  level = "h2",
  className,
}: HeadingProps) {
  const HeadingTag = level;

  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow ? (
        <p className="mb-3 text-xs uppercase tracking-[0.22em] text-accent-gold">
          <T text={eyebrow} />
        </p>
      ) : null}
      <HeadingTag className="max-w-4xl font-heading text-3xl leading-[1.15] text-text-primary sm:text-4xl md:text-5xl">
        <T text={title} />
      </HeadingTag>
      {description ? (
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-text-secondary md:text-lg">
          <T text={description} />
        </p>
      ) : null}
    </div>
  );
}
