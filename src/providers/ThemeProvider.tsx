import { useState } from "react";
import ThemeContext from "../context/Theme/ThemeContext";
import type { ThemeMode } from "../context/Theme/types";

const STORAGE_KEY = "dashboardTheme";

/** Dashboard-only preference — the landing/marketing site never reads this. Falls back to the OS preference the first time, then remembers whatever the owner explicitly picked. */
const readInitialTheme = (): ThemeMode => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
        return stored;
    }

    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setThemeState] = useState<ThemeMode>(() => readInitialTheme());

    const setTheme = (next: ThemeMode) => {
        setThemeState(next);
        localStorage.setItem(STORAGE_KEY, next);
    };

    const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

    return <ThemeContext value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext>;
};
