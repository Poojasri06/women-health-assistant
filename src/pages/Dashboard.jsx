import React, { useEffect, useState } from "react";
import { CalendarHeart, Droplets, Sparkles, HeartPulse, Salad, Footprints } from "lucide-react";
import AppLayout from "../components/AppLayout";
import { StatCard, Badge, AlertBanner } from "../components/UI";
import CyclePhaseWheel from "../components/charts/CyclePhaseWheel";
import api from "../api/api";

const INSIGHT_TONE = { positive: "positive", watch: "watch", tip: "tip", neutral: "neutral" };

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard/summary")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppLayout title="Dashboard">
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-plum-200 border-t-rose-500 rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Dashboard">
        <AlertBanner tone="error">{error}</AlertBanner>
      </AppLayout>
    );
  }

  const { summary, recommendation, insights, risk_warnings } = data;

  return (
    <AppLayout title="Dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Cycle wheel hero card */}
        <div className="card lg:col-span-1 flex flex-col items-center justify-center">
          <p className="text-sm font-medium text-plum-500 dark:text-plum-300 mb-3">{summary.current_cycle_status}</p>
          <CyclePhaseWheel
            activePhase={summary.cycle_phase}
            dayInCycle={summary.days_since_period_start}
            cycleLength={summary.current_cycle_length}
          />
          {summary.total_periods_logged === 0 && (
            <p className="text-xs text-center text-plum-400 mt-3 max-w-[200px]">
              Log your first period to start seeing predictions here.
            </p>
          )}
        </div>

        {/* Stat cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            icon={CalendarHeart}
            label="Next period"
            value={summary.predicted_next_period ? new Date(summary.predicted_next_period).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
            sub={summary.days_until_next_period != null ? `${summary.days_until_next_period >= 0 ? "in" : ""} ${Math.abs(summary.days_until_next_period)} day(s) ${summary.days_until_next_period < 0 ? "overdue" : ""}` : "Log periods to predict"}
            accent="rose"
          />
          <StatCard
            icon={Sparkles}
            label="Ovulation date"
            value={summary.ovulation_date ? new Date(summary.ovulation_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
            sub={summary.prediction_method ? `${summary.prediction_method === "ml" ? "ML-based" : "Average-based"} prediction` : ""}
          />
          <StatCard
            icon={Droplets}
            label="Fertility window"
            value={summary.fertility_window_start ? `${new Date(summary.fertility_window_start).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${new Date(summary.fertility_window_end).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}` : "—"}
          />
          <StatCard
            icon={HeartPulse}
            label="Cycle regularity"
            value={summary.cycle_regularity ? summary.cycle_regularity.replace(/^\w/, (c) => c.toUpperCase()) : "Not enough data"}
            sub={summary.cycle_regularity_std_days != null ? `±${summary.cycle_regularity_std_days} days variation` : ""}
          />
        </div>
      </div>

      {risk_warnings?.length > 0 && (
        <div className="mt-5 space-y-2">
          {risk_warnings.map((w, i) => (
            <AlertBanner key={i} tone="watch">{w}</AlertBanner>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        {/* Insights */}
        <div className="card">
          <h2 className="font-display text-lg text-ink-900 dark:text-blush-50 mb-4">Health insights</h2>
          <div className="space-y-3">
            {insights.map((ins, i) => (
              <div key={i} className="border-b border-plum-50 dark:border-plum-800 last:border-0 pb-3 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge tone={INSIGHT_TONE[ins.type]}>{ins.title}</Badge>
                </div>
                <p className="text-sm text-plum-600 dark:text-plum-300">{ins.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="card">
          <h2 className="font-display text-lg text-ink-900 dark:text-blush-50 mb-1">Today's recommendations</h2>
          <p className="text-xs text-plum-400 mb-4">{recommendation.reason}</p>

          <div className="mb-4">
            <p className="flex items-center gap-1.5 text-sm font-medium text-plum-700 dark:text-plum-200 mb-2">
              <Salad size={16} /> Foods to favor
            </p>
            <div className="flex flex-wrap gap-2">
              {recommendation.foods.map((f, i) => <Badge key={i}>{f}</Badge>)}
            </div>
          </div>

          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-plum-700 dark:text-plum-200 mb-2">
              <Footprints size={16} /> Movement ideas
            </p>
            <div className="flex flex-wrap gap-2">
              {recommendation.exercises.map((ex, i) => <Badge key={i} tone="tip">{ex}</Badge>)}
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-plum-400 text-center mt-6">
        Aura provides general wellness information based on your own logged data. It is not a substitute for medical advice.
      </p>
    </AppLayout>
  );
}
