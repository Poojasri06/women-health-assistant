import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import AppLayout from "../components/AppLayout";
import { AlertBanner, Badge } from "../components/UI";
import api from "../api/api";
import "react-calendar/dist/Calendar.css";

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

export default function PeriodTracker() {
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ start_date: "", end_date: "", flow_intensity: "medium", notes: "" });

  function load() {
    setLoading(true);
    api.get("/periods").then((res) => setPeriods(res.data.periods)).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function openAddForm() {
    setEditingId(null);
    setForm({ start_date: "", end_date: "", flow_intensity: "medium", notes: "" });
    setShowForm(true);
  }

  function openEditForm(p) {
    setEditingId(p.id);
    setForm({ start_date: p.start_date, end_date: p.end_date || "", flow_intensity: p.flow_intensity || "medium", notes: p.notes || "" });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form, end_date: form.end_date || null };
      if (editingId) {
        await api.put(`/periods/${editingId}`, payload);
      } else {
        await api.post("/periods", payload);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this period record?")) return;
    try {
      await api.delete(`/periods/${id}`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  // Mark logged period days on the calendar
  const loggedDates = new Set();
  periods.forEach((p) => {
    const start = new Date(p.start_date);
    const end = p.end_date ? new Date(p.end_date) : start;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      loggedDates.add(formatDate(new Date(d)));
    }
  });

  return (
    <AppLayout title="Period Tracker">
      {error && <AlertBanner tone="error">{error}</AlertBanner>}

      <div className="flex justify-end mb-4">
        <button onClick={openAddForm} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Log a period
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card">
          <h2 className="font-display text-lg text-ink-900 dark:text-blush-50 mb-4">Calendar</h2>
          <Calendar
            tileClassName={({ date }) =>
              loggedDates.has(formatDate(date)) ? "period-day" : null
            }
            className="aura-calendar"
          />
          <style>{`
            .aura-calendar { width: 100%; border: none; font-family: 'Inter', sans-serif; }
            .period-day { background: #FFB7CF !important; border-radius: 8px; color: #4F2069 !important; }
          `}</style>
        </div>

        <div className="card">
          <h2 className="font-display text-lg text-ink-900 dark:text-blush-50 mb-4">Cycle history</h2>
          {loading ? (
            <p className="text-sm text-plum-400">Loading...</p>
          ) : periods.length === 0 ? (
            <p className="text-sm text-plum-400">No periods logged yet. Tap "Log a period" to add your first one.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-plum-500 dark:text-plum-300 border-b border-plum-100 dark:border-plum-800">
                    <th className="py-2 pr-2">Start</th>
                    <th className="py-2 pr-2">End</th>
                    <th className="py-2 pr-2">Cycle (days)</th>
                    <th className="py-2 pr-2">Flow</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {[...periods].reverse().map((p) => (
                    <tr key={p.id} className="border-b border-plum-50 dark:border-plum-800 last:border-0">
                      <td className="py-2 pr-2">{new Date(p.start_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                      <td className="py-2 pr-2">{p.end_date ? new Date(p.end_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}</td>
                      <td className="py-2 pr-2">{p.cycle_length ?? "—"}</td>
                      <td className="py-2 pr-2">{p.flow_intensity ? <Badge>{p.flow_intensity}</Badge> : "—"}</td>
                      <td className="py-2 flex gap-2 justify-end">
                        <button onClick={() => openEditForm(p)} className="p-1.5 rounded-lg hover:bg-plum-100 dark:hover:bg-plum-800 text-plum-500"><Pencil size={15} /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-500"><Trash2 size={15} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={() => setShowForm(false)}>
          <div className="card w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-lg text-ink-900 dark:text-blush-50">{editingId ? "Edit period" : "Log a period"}</h3>
              <button onClick={() => setShowForm(false)} className="text-plum-400 hover:text-plum-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-plum-700 dark:text-plum-200 mb-1.5">Start date</label>
                <input type="date" required className="input-field" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-plum-700 dark:text-plum-200 mb-1.5">End date (optional)</label>
                <input type="date" className="input-field" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-plum-700 dark:text-plum-200 mb-1.5">Flow intensity</label>
                <select className="input-field" value={form.flow_intensity} onChange={(e) => setForm({ ...form, flow_intensity: e.target.value })}>
                  <option value="light">Light</option>
                  <option value="medium">Medium</option>
                  <option value="heavy">Heavy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-plum-700 dark:text-plum-200 mb-1.5">Notes (optional)</label>
                <textarea className="input-field" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <button type="submit" className="btn-primary w-full">{editingId ? "Save changes" : "Add period"}</button>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
