import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler,
} from "chart.js";
import AppLayout from "../components/AppLayout";
import { AlertBanner } from "../components/UI";
import api from "../api/api";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const MOODS = [
  { key: "happy", emoji: "😊", label: "Happy", value: 5 },
  { key: "neutral", emoji: "😐", label: "Neutral", value: 3 },
  { key: "sad", emoji: "😔", label: "Sad", value: 2 },
  { key: "stressed", emoji: "😣", label: "Stressed", value: 1.5 },
  { key: "angry", emoji: "😠", label: "Angry", value: 1 },
];
const MOOD_VALUE = Object.fromEntries(MOODS.map((m) => [m.key, m.value]));

export default function MoodTracker() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);

  function loadReport() {
    api.get("/moods/weekly-report").then((res) => setReport(res.data.report)).catch((err) => setError(err.message));
  }

  useEffect(() => { loadReport(); }, []);

  async function logMood(moodKey) {
    setError("");
    setSelectedMood(moodKey);
    try {
      await api.post("/moods", { mood: moodKey, note });
      setNote("");
      loadReport();
    } catch (err) {
      setError(err.message);
    }
  }

  const chartData = report && {
    labels: report.daily.map((d) => new Date(d.date).toLocaleDateString("en-IN", { weekday: "short" })),
    datasets: [{
      label: "Mood",
      data: report.daily.map((d) => (d.mood ? MOOD_VALUE[d.mood] : null)),
      borderColor: "#E8336F",
      backgroundColor: "rgba(232,51,111,0.12)",
      fill: true,
      tension: 0.35,
      spanGaps: true,
      pointBackgroundColor: "#7C3AA8",
      pointRadius: 5,
    }],
  };

  return (
    <AppLayout title="Mood Tracker">
      {error && <AlertBanner tone="error">{error}</AlertBanner>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4">
        <div className="card">
          <h2 className="font-display text-lg text-ink-900 dark:text-blush-50 mb-4">How are you feeling today?</h2>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {MOODS.map((m) => (
              <button
                key={m.key}
                onClick={() => logMood(m.key)}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all ${
                  selectedMood === m.key ? "border-rose-400 bg-rose-50 dark:bg-rose-900/20" : "border-plum-100 dark:border-plum-800 hover:bg-plum-50 dark:hover:bg-plum-800"
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-[11px] text-plum-600 dark:text-plum-200">{m.label}</span>
              </button>
            ))}
          </div>
          <label className="block text-sm font-medium text-plum-700 dark:text-plum-200 mb-1.5">Add a note (optional)</label>
          <textarea className="input-field" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="What's on your mind?" />
        </div>

        <div className="card">
          <h2 className="font-display text-lg text-ink-900 dark:text-blush-50 mb-4">This week's mood report</h2>
          {!report ? (
            <p className="text-sm text-plum-400">Loading...</p>
          ) : report.total_entries === 0 ? (
            <p className="text-sm text-plum-400">No mood entries yet this week — log how you're feeling to see your trend.</p>
          ) : (
            <>
              <div className="h-48 mb-4">
                <Line data={chartData} options={{
                  responsive: true, maintainAspectRatio: false,
                  scales: { y: { min: 0, max: 6, ticks: { display: false }, grid: { color: "rgba(124,58,168,0.06)" } }, x: { grid: { display: false } } },
                  plugins: { legend: { display: false } },
                }} />
              </div>
              <div className="space-y-1.5">
                {report.breakdown.map((b) => (
                  <div key={b.mood} className="flex items-center justify-between text-sm">
                    <span className="capitalize text-plum-600 dark:text-plum-200">{b.mood}</span>
                    <span className="text-plum-400">{b.count} ({b.percentage}%)</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
