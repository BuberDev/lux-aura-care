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
      <h2 className="font-heading text-3xl leading-tight text-text-primary sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-2xl text-base text-text-secondary md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
