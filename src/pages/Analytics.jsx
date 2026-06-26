import React, { useEffect, useState } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, ArcElement, Tooltip, Legend,
} from "chart.js";
import AppLayout from "../components/AppLayout";
import { AlertBanner } from "../components/UI";
import api from "../api/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

const PALETTE = ["#7C3AA8", "#E8336F", "#C690D6", "#F45D93", "#4F2069", "#FFB7CF"];

export default function Analytics() {
  const [cycleTrend, setCycleTrend] = useState(null);
  const [symptomFreq, setSymptomFreq] = useState(null);
  const [moodTrend, setMoodTrend] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/analytics/cycle-length-trend"),
      api.get("/analytics/symptom-frequency"),
      api.get("/analytics/mood-trend"),
      api.get("/analytics/prediction-accuracy"),
    ])
      .then(([a, b, c, d]) => {
        setCycleTrend(a.data.data);
        setSymptomFreq(b.data);
        setMoodTrend(c.data);
        setAccuracy(d.data);
      })
      .catch((err) => setError(err.message));
  }, []);

  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { grid: { display: false } }, y: { grid: { color: "rgba(124,58,168,0.06)" } } },
  };

  return (
    <AppLayout title="Analytics">
      {error && <AlertBanner tone="error">{error}</AlertBanner>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4">
        <div className="card">
          <h2 className="font-display text-lg text-ink-900 dark:text-blush-50 mb-1">Cycle length trend</h2>
          <p className="text-xs text-plum-400 mb-4">How your cycle length has changed over time</p>
          <div className="h-64">
            {cycleTrend && cycleTrend.length > 0 ? (
              <Line
                data={{
                  labels: cycleTrend.map((d) => new Date(d.start_date).toLocaleDateString("en-IN", { month: "short", year: "2-digit" })),
                  datasets: [{ label: "Cycle length", data: cycleTrend.map((d) => d.cycle_length), borderColor: "#7C3AA8", backgroundColor: "rgba(124,58,168,0.1)", tension: 0.3, fill: true }],
                }}
                options={chartOpts}
              />
            ) : <p className="text-sm text-plum-400">Log at least 2 periods to see this trend.</p>}
          </div>
        </div>

        <div className="card">
          <h2 className="font-display text-lg text-ink-900 dark:text-blush-50 mb-1">Symptom frequency</h2>
          <p className="text-xs text-plum-400 mb-4">Most frequently logged symptoms</p>
          <div className="h-64">
            {symptomFreq && symptomFreq.by_symptom.length > 0 ? (
              <Bar
                data={{
                  labels: symptomFreq.by_symptom.map((s) => s.symptom),
                  datasets: [{ data: symptomFreq.by_symptom.map((s) => s.count), backgroundColor: PALETTE, borderRadius: 6 }],
                }}
                options={chartOpts}
              />
            ) : <p className="text-sm text-plum-400">Log symptoms to see this chart.</p>}
          </div>
        </div>

        <div className="card">
          <h2 className="font-display text-lg text-ink-900 dark:text-blush-50 mb-1">Mood breakdown</h2>
          <p className="text-xs text-plum-400 mb-4">Distribution of all logged moods</p>
          <div className="h-64 flex items-center justify-center">
            {moodTrend && moodTrend.breakdown.length > 0 ? (
              <Doughnut
                data={{
                  labels: moodTrend.breakdown.map((m) => m.mood),
                  datasets: [{ data: moodTrend.breakdown.map((m) => m.count), backgroundColor: PALETTE }],
                }}
                options={{ maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { boxWidth: 12 } } } }}
              />
            ) : <p className="text-sm text-plum-400">Log moods to see this chart.</p>}
          </div>
        </div>

        <div className="card">
          <h2 className="font-display text-lg text-ink-900 dark:text-blush-50 mb-1">Prediction accuracy</h2>
          <p className="text-xs text-plum-400 mb-4">How close past predictions were to your actual period start</p>
          {accuracy && accuracy.comparisons.length > 0 ? (
            <>
              <p className="text-3xl font-display text-plum-700 dark:text-plum-200 mb-3">±{accuracy.average_error_days} days</p>
              <p className="text-xs text-plum-400 mb-3">average prediction error</p>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {accuracy.comparisons.map((c, i) => (
                  <div key={i} className="flex justify-between text-xs text-plum-500 dark:text-plum-300">
                    <span>Predicted {new Date(c.predicted_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                    <span>Off by {c.error_days}d ({c.method})</span>
                  </div>
                ))}
              </div>
            </>
          ) : <p className="text-sm text-plum-400">Accuracy will appear once you have predictions followed by a logged period.</p>}
        </div>
      </div>
    </AppLayout>
  );
}
