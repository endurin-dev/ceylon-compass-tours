"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem("admin-theme"); } catch {}
    const initial: Theme =
      saved === "light" || saved === "dark"
        ? saved
        : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.dataset.theme = initial;
    setTheme(initial);
  }, []);

  function choose(next: Theme) {
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("admin-theme", next); } catch {}
    setTheme(next);
  }

  return (
    <div className={styles.theme} role="group" aria-label="Colour theme">
      <button type="button" aria-pressed={theme === "light"} onClick={() => choose("light")} title="Day mode">
        <Sun size={16} aria-hidden="true" /> <span>Day</span>
      </button>
      <button type="button" aria-pressed={theme === "dark"} onClick={() => choose("dark")} title="Night mode">
        <Moon size={16} aria-hidden="true" /> <span>Night</span>
      </button>
    </div>
  );
}