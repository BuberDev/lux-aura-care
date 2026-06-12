"use client";

import { Moon, Sun } from "lucide-react";

import { applyTheme, getActiveTheme } from "@/components/theme-provider";
import { useI18n } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
  showLabel?: boolean;
};

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { t } = useI18n();
  const toggleTheme = () => {
    applyTheme(getActiveTheme() === "dark" ? "light" : "dark", true);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "group inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border-subtle bg-surface-glass px-3 text-text-secondary shadow-sm backdrop-blur-xl transition-all hover:border-accent-gold/50 hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold",
        className
      )}
      aria-label={t("theme.switch")}
      title={t("theme.switch")}
    >
      <span className="relative size-4" aria-hidden="true">
        <Sun className="theme-icon-light absolute inset-0 size-4 transition-all duration-300" />
        <Moon className="theme-icon-dark absolute inset-0 size-4 transition-all duration-300" />
      </span>
      {showLabel ? <span className="text-[11px] font-medium uppercase tracking-[0.12em]">{t("theme.label")}</span> : null}
    </button>
  );
}
