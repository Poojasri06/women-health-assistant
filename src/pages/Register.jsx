import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", age: "", email: "", password: "", confirm_password: "",
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);
    setLoading(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setErrors(err.response?.data?.errors || [err.message] || ["Could not register."]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-plum-rose-soft dark:bg-ink-900 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="text-rose-500" size={28} />
          <span className="font-display text-2xl text-plum-800 dark:text-blush-50">Aura</span>
        </div>
        <div className="card">
          <h1 className="font-display text-2xl text-ink-900 dark:text-blush-50 mb-1">Create your account</h1>
          <p className="text-sm text-plum-500 dark:text-plum-300 mb-6">Start tracking your cycle privately and securely.</p>

          {errors.length > 0 && (
            <ul className="text-sm text-rose-600 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-300 rounded-lg px-3 py-2 mb-4 list-disc list-inside space-y-0.5">
              {errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-plum-700 dark:text-plum-200 mb-1.5">Full name</label>
              <input required className="input-field" value={form.name} onChange={(e) => update("name", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-plum-700 dark:text-plum-200 mb-1.5">Age</label>
              <input type="number" min="10" max="100" required className="input-field" value={form.age} onChange={(e) => update("age", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-plum-700 dark:text-plum-200 mb-1.5">Email</label>
              <input type="email" required className="input-field" value={form.email} onChange={(e) => update("email", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-plum-700 dark:text-plum-200 mb-1.5">Password</label>
              <input type="password" required minLength={8} className="input-field" value={form.password} onChange={(e) => update("password", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-plum-700 dark:text-plum-200 mb-1.5">Confirm password</label>
              <input type="password" required minLength={8} className="input-field" value={form.confirm_password} onChange={(e) => update("confirm_password", e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-60">
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-sm text-center text-plum-500 dark:text-plum-300 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-rose-500 font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
