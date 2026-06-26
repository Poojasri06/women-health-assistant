import React, { useEffect, useState } from "react";
import { Menu, Moon, Sun, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import api from "../api/api";

export default function Navbar({ onMenuClick, title }) {
  const { darkMode, toggleDarkMode } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    api
      .get("/notifications")
      .then((res) => setUnreadCount(res.data.unread_count))
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-blush-50/90 dark:bg-ink-900/90 backdrop-blur-sm border-b border-plum-100 dark:border-plum-800 px-4 sm:px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-plum-100 dark:hover:bg-plum-800 text-plum-700 dark:text-plum-100"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="font-display text-xl sm:text-2xl text-plum-800 dark:text-blush-50">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to="/notifications"
          className="relative p-2.5 rounded-full hover:bg-plum-100 dark:hover:bg-plum-800 text-plum-700 dark:text-plum-100"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-semibold w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center rounded-full">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-full hover:bg-plum-100 dark:hover:bg-plum-800 text-plum-700 dark:text-plum-100"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}
