import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Could not log in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-plum-rose-soft dark:bg-ink-900 px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="text-rose-500" size={28} />
          <span className="font-display text-2xl text-plum-800 dark:text-blush-50">Aura</span>
        </div>
        <div className="card">
          <h1 className="font-display text-2xl text-ink-900 dark:text-blush-50 mb-1">Welcome back</h1>
          <p className="text-sm text-plum-500 dark:text-plum-300 mb-6">Log in to see your cycle and insights.</p>

          {error && <p className="text-sm text-rose-600 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-300 rounded-lg px-3 py-2 mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-plum-700 dark:text-plum-200 mb-1.5">Email</label>
              <input
                type="email" required className="input-field" placeholder="you@example.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-plum-700 dark:text-plum-200 mb-1.5">Password</label>
              <input
                type="password" required className="input-field" placeholder="••••••••"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-60">
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="text-sm text-center text-plum-500 dark:text-plum-300 mt-6">
            New here?{" "}
            <Link to="/register" className="text-rose-500 font-medium hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
