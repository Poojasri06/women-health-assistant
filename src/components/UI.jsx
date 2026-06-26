import React from "react";

export function StatCard({ icon: Icon, label, value, sub, accent = "plum" }) {
  const accentClasses = {
    plum: "bg-plum-50 dark:bg-plum-800 text-plum-600 dark:text-plum-200",
    rose: "bg-rose-50 dark:bg-rose-900/30 text-rose-500 dark:text-rose-300",
  };
  return (
    <div className="card flex items-start gap-4">
      <div className={`p-3 rounded-xl ${accentClasses[accent]}`}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-plum-500 dark:text-plum-300 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-display text-ink-900 dark:text-blush-50 mt-0.5 truncate">{value}</p>
        {sub && <p className="text-xs text-plum-400 dark:text-plum-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-plum-100 text-plum-700 dark:bg-plum-800 dark:text-plum-100",
    positive: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    watch: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    tip: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    mild: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    moderate: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    severe: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  };
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${tones[tone] || tones.neutral}`}>
      {children}
    </span>
  );
}

export function AlertBanner({ tone = "watch", children }) {
  const tones = {
    watch: "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-200",
    error: "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-300",
  };
  return (
    <div className={`border rounded-xl p-4 text-sm ${tones[tone]}`}>{children}</div>
  );
}
