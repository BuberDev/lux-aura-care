import { AlertCircle, TrendingUp, Zap } from "lucide-react";

type UrgencyBadgeProps = {
  readonly label: string;
  readonly intensity: "low" | "medium" | "high";
  readonly compact?: boolean;
};

export function UrgencyBadge({ label, intensity, compact = false }: UrgencyBadgeProps) {
  const intensityConfig = {
    low: {
      bgColor: "bg-white/[0.05]",
      borderColor: "border-white/10",
      textColor: "text-text-secondary",
      icon: null,
    },
    medium: {
      bgColor: "bg-accent-gold/10",
      borderColor: "border-accent-gold/25",
      textColor: "text-accent-gold",
      icon: TrendingUp,
    },
    high: {
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      textColor: "text-red-400",
      icon: Zap,
    },
  };

  const config = intensityConfig[intensity];
  const Icon = config.icon;

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border ${config.borderColor} ${config.bgColor} px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.1em] ${config.textColor}`}
      >
        {Icon && <Icon className="size-3" aria-hidden="true" />}
        {label}
      </span>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border ${config.borderColor} ${config.bgColor} px-3 py-2`}
    >
      {Icon && (
        <Icon className={`size-5 shrink-0 ${config.textColor}`} aria-hidden="true" />
      )}
      <div className="flex flex-col gap-0.5">
        <p className={`text-xs font-semibold uppercase tracking-[0.1em] ${config.textColor}`}>
          {label}
        </p>
        {intensity === "high" && (
          <p className="text-xs text-text-secondary">Limited availability</p>
        )}
      </div>
    </div>
  );
}
