import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full rounded-full border border-white/15 bg-white/5 px-4 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary focus-visible:border-accent-gold",
        className
      )}
      {...props}
    />
  );
}

export { Input };
