import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, CalendarHeart, Activity, Smile, Lightbulb,
  Bell, FileText, BarChart3, MessageCircleQuestion, LogOut, Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/periods", label: "Period Tracker", icon: CalendarHeart },
  { to: "/symptoms", label: "Symptoms", icon: Activity },
  { to: "/mood", label: "Mood Tracker", icon: Smile },
  { to: "/insights", label: "Health Insights", icon: Lightbulb },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/assistant", label: "Smart Assistant", icon: MessageCircleQuestion },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-72 bg-plum-rose text-white z-40 flex flex-col
        transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex items-center gap-2 px-6 py-6">
          <Sparkles size={26} className="text-rose-200" />
          <span className="font-display text-xl tracking-tight">Aura</span>
        </div>
        <p className="px-6 text-xs text-plum-100/80 -mt-3 mb-4">Women's Health Assistant</p>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 ${
                  isActive ? "bg-white/15 text-white" : "text-plum-50/85 hover:bg-white/10"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-5 border-t border-white/10">
          <div className="px-2 mb-3">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-plum-100/70 truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-xl text-sm font-medium text-plum-50/90 hover:bg-white/10 transition-colors"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>
    </>
  );
}
