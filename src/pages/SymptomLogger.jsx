import React, { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import AppLayout from "../components/AppLayout";
import { AlertBanner, Badge } from "../components/UI";
import api from "../api/api";

const PHYSICAL = ["Cramps", "Headache", "Bloating", "Fatigue", "Acne", "Back Pain"];
const EMOTIONAL = ["Mood Swings", "Anxiety", "Stress", "Irritability"];
const SEVERITIES = ["mild", "moderate", "severe"];

export default function SymptomLogger() {
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ symptom: "Cramps", severity: "mild", date: new Date().toISOString().slice(0, 10) });

  function load() {
    setLoading(true);
    api.get("/symptoms").then((res) => setSymptoms(res.data.symptoms)).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/symptoms", form);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/symptoms/${id}`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AppLayout title="Symptoms">
      {error && <AlertBanner tone="error">{error}</AlertBanner>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-4">
        <div className="card lg:col-span-1">
          <h2 className="font-display text-lg text-ink-900 dark:text-blush-50 mb-4 flex items-center gap-2">
            <Plus size={18} /> Log a symptom
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-plum-700 dark:text-plum-200 mb-1.5">Physical</label>
              <div className="flex flex-wrap gap-2">
                {PHYSICAL.map((s) => (
                  <button
                    type="button" key={s}
                    onClick={() => setForm({ ...form, symptom: s })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      form.symptom === s ? "bg-plum-rose text-white border-transparent" : "border-plum-200 dark:border-plum-700 text-plum-600 dark:text-plum-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-plum-700 dark:text-plum-200 mb-1.5">Emotional</label>
              <div className="flex flex-wrap gap-2">
                {EMOTIONAL.map((s) => (
                  <button
                    type="button" key={s}
                    onClick={() => setForm({ ...form, symptom: s })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      form.symptom === s ? "bg-plum-rose text-white border-transparent" : "border-plum-200 dark:border-plum-700 text-plum-600 dark:text-plum-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-plum-700 dark:text-plum-200 mb-1.5">Severity</label>
              <select className="input-field" value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
                {SEVERITIES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-plum-700 dark:text-plum-200 mb-1.5">Date</label>
              <input type="date" className="input-field" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary w-full">Log symptom</button>
          </form>
        </div>

        <div className="card lg:col-span-2">
          <h2 className="font-display text-lg text-ink-900 dark:text-blush-50 mb-4">Symptom history</h2>
          {loading ? (
            <p className="text-sm text-plum-400">Loading...</p>
          ) : symptoms.length === 0 ? (
            <p className="text-sm text-plum-400">No symptoms logged yet.</p>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {symptoms.map((s) => (
                <div key={s.id} className="flex items-center justify-between border-b border-plum-50 dark:border-plum-800 last:border-0 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-ink-900 dark:text-blush-50">{s.symptom}</p>
                    <p className="text-xs text-plum-400">{new Date(s.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {s.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={s.severity}>{s.severity}</Badge>
                    <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-500"><Trash2 size={15} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
