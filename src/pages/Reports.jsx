import React, { useState } from "react";
import { FileText, Download } from "lucide-react";
import AppLayout from "../components/AppLayout";
import { AlertBanner } from "../components/UI";
import api from "../api/api";

export default function Reports() {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  async function handleDownload() {
    setError("");
    setDownloading(true);
    try {
      const res = await api.get("/reports/health-report", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "health_report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "Could not generate report.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <AppLayout title="Health Reports">
      {error && <AlertBanner tone="error">{error}</AlertBanner>}

      <div className="card max-w-xl mt-4 text-center py-10">
        <div className="w-16 h-16 rounded-2xl bg-plum-50 dark:bg-plum-800 text-plum-600 dark:text-plum-200 flex items-center justify-center mx-auto mb-4">
          <FileText size={28} />
        </div>
        <h2 className="font-display text-xl text-ink-900 dark:text-blush-50 mb-2">Download your health report</h2>
        <p className="text-sm text-plum-500 dark:text-plum-300 mb-6 max-w-sm mx-auto">
          A complete PDF with your user details, cycle history, predictions, symptoms, mood analysis, and health insights — ready to share with a doctor if you'd like.
        </p>
        <button onClick={handleDownload} disabled={downloading} className="btn-primary inline-flex items-center gap-2 disabled:opacity-60">
          <Download size={18} /> {downloading ? "Generating..." : "Download PDF report"}
        </button>
      </div>
    </AppLayout>
  );
}
