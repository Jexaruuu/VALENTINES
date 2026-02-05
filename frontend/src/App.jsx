// App.jsx
import React, { createContext, useEffect, useMemo, useState } from "react";
import Menu from "./homepage/Menu";

export const ThemeContext = createContext({
    theme: "red",
    toggleTheme: () => {},
    setTheme: () => {},
});

export default function App() {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem("theme_mode");
        return saved === "blue" || saved === "red" ? saved : "red";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme_mode", theme);
    }, [theme]);

    const toggleTheme = () => setTheme((t) => (t === "red" ? "blue" : "red"));

    const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            <Menu />
        </ThemeContext.Provider>
    );
}
