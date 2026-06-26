import React, { useEffect, useState } from "react";
import { Lightbulb, ShieldAlert } from "lucide-react";
import AppLayout from "../components/AppLayout";
import { AlertBanner, Badge } from "../components/UI";
import api from "../api/api";

export default function Insights() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/insights").then((res) => setData(res.data)).catch((err) => setError(err.message));
  }, []);

  return (
    <AppLayout title="Health Insights">
      {error && <AlertBanner tone="error">{error}</AlertBanner>}
      {!data ? (
        <p className="text-sm text-plum-400 mt-4">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4">
          <div className="card">
            <h2 className="font-display text-lg text-ink-900 dark:text-blush-50 mb-4 flex items-center gap-2">
              <Lightbulb size={18} className="text-rose-500" /> Personalized insights
            </h2>
            <div className="space-y-4">
              {data.insights.map((ins, i) => (
                <div key={i} className="border-b border-plum-50 dark:border-plum-800 last:border-0 pb-3 last:pb-0">
                  <Badge tone={ins.type}>{ins.title}</Badge>
                  <p className="text-sm text-plum-600 dark:text-plum-300 mt-2">{ins.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="font-display text-lg text-ink-900 dark:text-blush-50 mb-4 flex items-center gap-2">
              <ShieldAlert size={18} className="text-amber-500" /> Health risk awareness
            </h2>
            <p className="text-xs text-plum-400 mb-4">
              These are pattern-based observations from your own logged data — never a diagnosis. Please consult a doctor for any medical concerns.
            </p>
            {data.risk_warnings.length === 0 ? (
              <p className="text-sm text-plum-500 dark:text-plum-300">No risk patterns detected right now. Keep logging consistently for the most accurate picture.</p>
            ) : (
              <div className="space-y-3">
                {data.risk_warnings.map((w, i) => (
                  <AlertBanner key={i} tone="watch">{w}</AlertBanner>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
