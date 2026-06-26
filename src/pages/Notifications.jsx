import React, { useEffect, useState } from "react";
import { Bell, Droplet, CalendarHeart, Pill, HeartPulse, CheckCircle2 } from "lucide-react";
import AppLayout from "../components/AppLayout";
import { AlertBanner } from "../components/UI";
import api from "../api/api";

const ICONS = {
  period_reminder: CalendarHeart,
  ovulation_reminder: HeartPulse,
  fertility_reminder: HeartPulse,
  water_reminder: Droplet,
  medication_reminder: Pill,
  health_check_reminder: Bell,
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [medForm, setMedForm] = useState({ medication_name: "", date: new Date().toISOString().slice(0, 10) });

  function load() {
    api.get("/notifications").then((res) => setNotifications(res.data.notifications)).catch((err) => setError(err.message));
  }

  useEffect(() => { load(); }, []);

  async function markRead(id) {
    try {
      await api.put(`/notifications/${id}/read`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function addMedicationReminder(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/notifications/medication-reminder", medForm);
      setMedForm({ medication_name: "", date: new Date().toISOString().slice(0, 10) });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AppLayout title="Notifications">
      {error && <AlertBanner tone="error">{error}</AlertBanner>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-4">
        <div className="card lg:col-span-2">
          <h2 className="font-display text-lg text-ink-900 dark:text-blush-50 mb-4">Notification center</h2>
          {notifications.length === 0 ? (
            <p className="text-sm text-plum-400">No notifications yet.</p>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {notifications.map((n) => {
                const Icon = ICONS[n.category] || Bell;
                return (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border ${
                      n.status === "unread" ? "bg-rose-50/60 dark:bg-rose-900/15 border-rose-100 dark:border-rose-900/30" : "border-plum-50 dark:border-plum-800"
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-plum-50 dark:bg-plum-800 text-plum-600 dark:text-plum-200 shrink-0">
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-900 dark:text-blush-50">{n.title}</p>
                      <p className="text-sm text-plum-500 dark:text-plum-300">{n.message}</p>
                      <p className="text-xs text-plum-400 mt-1">{new Date(n.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    {n.status === "unread" && (
                      <button onClick={() => markRead(n.id)} className="p-1.5 rounded-lg hover:bg-plum-100 dark:hover:bg-plum-800 text-plum-400 shrink-0" aria-label="Mark as read">
                        <CheckCircle2 size={16} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="font-display text-lg text-ink-900 dark:text-blush-50 mb-4 flex items-center gap-2">
            <Pill size={18} /> Add medication reminder
          </h2>
          <form onSubmit={addMedicationReminder} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-plum-700 dark:text-plum-200 mb-1.5">Medication name</label>
              <input required className="input-field" value={medForm.medication_name} onChange={(e) => setMedForm({ ...medForm, medication_name: e.target.value })} placeholder="e.g. Iron supplement" />
            </div>
            <div>
              <label className="block text-sm font-medium text-plum-700 dark:text-plum-200 mb-1.5">Date</label>
              <input type="date" className="input-field" value={medForm.date} onChange={(e) => setMedForm({ ...medForm, date: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary w-full">Add reminder</button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
