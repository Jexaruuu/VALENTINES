// Navigation.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "../App";

export default function Navigation() {
    const [scrolled, setScrolled] = useState(false);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [overlayOpen, setOverlayOpen] = useState(() => localStorage.getItem("jex_overlay_open") === "1");

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const sync = () => setOverlayOpen(localStorage.getItem("jex_overlay_open") === "1");
        const onOpen = () => setOverlayOpen(true);
        const onClose = () => setOverlayOpen(false);
        const onStorage = (e) => {
            if (e.key === "jex_overlay_open") sync();
        };

        window.addEventListener("jex_overlay_open", onOpen);
        window.addEventListener("jex_overlay_close", onClose);
        window.addEventListener("storage", onStorage);

        return () => {
            window.removeEventListener("jex_overlay_open", onOpen);
            window.removeEventListener("jex_overlay_close", onClose);
            window.removeEventListener("storage", onStorage);
        };
    }, []);

    const navItems = useMemo(
        () => [
            { label: "Home", href: "#" },
            { label: "Services", href: "#services" },
            { label: "Gallery", href: "#gallery" },
            { label: "Contact", href: "#contact" },
        ],
        []
    );

    const isBlue = theme === "blue";

    const RED_ICON = "/blush.gif";
    const BLUE_ICON = "/chill.gif";

    const KNOB_RED = "/blush.gif";
    const KNOB_BLUE = "/chill.gif";

    const KNOB_ICON = isBlue ? KNOB_BLUE : KNOB_RED;

    const LOGO_IMG = "/logo.gif";

    if (overlayOpen) return null;

    return (
        <header className="sticky top-0 z-50 font-['Poppins']">
            <div className="absolute inset-0 -z-10 bg-[var(--bg-via)]" />

            <div className="mx-auto w-full max-w-292 px-3 sm:px-6 pt-3 sm:pt-4 pb-3 sm:pb-4">
                <div
                    className={[
                        "group relative overflow-hidden rounded-[26px] sm:rounded-[28px]",
                        "border border-[var(--soft-border)]",
                        "bg-[var(--panel)] backdrop-blur-xl",
                        "shadow-[0_18px_50px_-38px_var(--shadow)]",
                        "transition-all duration-300 ease-out",
                        scrolled ? "bg-[var(--panel-strong)]" : "",
                    ].join(" ")}
                >
                    <div className="pointer-events-none absolute inset-0 -z-10">
                        <div className="absolute inset-x-0 top-0 h-px bg-white/70" />
                        <div className="absolute inset-x-0 bottom-0 h-px bg-[var(--line)]" />
                    </div>

                    <div className="relative flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-6 py-3 sm:py-3.5">
                        <a
                            href="/"
                            className="group/brand min-w-0 inline-flex items-center gap-2 sm:gap-3 rounded-3xl p-1 transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0"
                            aria-label="Go to homepage"
                        >
                            <span className="relative grid h-10 w-10 sm:h-11 sm:w-11 shrink-0 place-items-center">
                                <img src={LOGO_IMG} alt="Logo" className="h-full w-full object-contain" draggable="false" />
                            </span>

                            <span className="min-w-0 flex flex-col leading-tight">
                                <span className="truncate text-[13px] sm:text-sm font-extrabold tracking-tight text-slate-900">
                                    ADOY&apos;S VALENTINE
                                </span>
                                <span className="truncate text-[11px] sm:text-xs text-slate-500">
                                    Happy Valentine&apos;s Day!
                                </span>
                            </span>
                        </a>

                        <nav className="hidden items-center gap-2 sm:flex" aria-label="Primary navigation">
                            <div className="flex items-center rounded-3xl border border-[var(--soft-border)] bg-[var(--pill)] p-1 backdrop-blur transition-all duration-300 ease-out group-hover:bg-[var(--pill-strong)]">
                                {navItems.map((item) => (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        className={[
                                            "group/link relative isolate rounded-3xl px-4 py-2 text-sm font-semibold",
                                            "text-slate-700",
                                            "transition-all duration-200 ease-out",
                                            "hover:text-[var(--accent-text)]",
                                            "hover:-translate-y-0.5 active:translate-y-0",
                                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-white/70",
                                        ].join(" ")}
                                    >
                                        <span className="relative z-10">{item.label}</span>
                                        <span className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-white/85 opacity-0 shadow-[0_14px_28px_-24px_var(--shadow)] transition-opacity duration-200 ease-out group-hover/link:opacity-100" />
                                        <span className="pointer-events-none absolute inset-x-4 bottom-1.5 h-0.5 origin-left scale-x-0 rounded-full bg-[var(--accent-solid)] transition-transform duration-200 ease-out group-hover/link:scale-x-100" />
                                    </a>
                                ))}
                            </div>
                        </nav>

                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className={[
                                    "group inline-flex items-center gap-2 sm:gap-3",
                                    "rounded-3xl border border-[var(--soft-border)] bg-[var(--pill)] px-3 py-2",
                                    "shadow-[0_12px_26px_-22px_var(--shadow)] backdrop-blur",
                                    "transition-all duration-200 ease-out",
                                    "hover:-translate-y-0.5 hover:bg-[var(--pill-strong)]",
                                    "active:translate-y-0",
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-white/70",
                                ].join(" ")}
                                role="switch"
                                aria-checked={isBlue}
                                aria-label="Toggle theme"
                            >
                                <span className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                                    <span className="grid h-5 w-5 place-items-center rounded-full bg-white/70 overflow-hidden">
                                        <img src={RED_ICON} alt="Red mode" className="h-full w-full object-cover" draggable="false" />
                                    </span>
                                    Blush
                                </span>

                                <span
                                    className={[
                                        "relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full",
                                        "bg-white/70 ring-1 ring-[var(--soft-border)]",
                                        "transition-all duration-200 ease-out",
                                    ].join(" ")}
                                >
                                    <span
                                        className={[
                                            "pointer-events-none absolute left-1 top-1 grid h-5 w-5 sm:h-6 sm:w-6 place-items-center rounded-full",
                                            "bg-white/80 shadow-sm overflow-hidden",
                                            "transition-transform duration-200 ease-out",
                                            isBlue ? "translate-x-5 sm:translate-x-6" : "translate-x-0",
                                        ].join(" ")}
                                    >
                                        <img src={KNOB_ICON} alt="Toggle" className="h-full w-full object-cover" draggable="false" />
                                    </span>

                                    <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
                                        <span
                                            className={[
                                                "absolute -left-1/2 top-0 h-full w-1/2 skew-x-[-18deg] bg-white/35 blur-sm",
                                                "transition-all duration-700 ease-out",
                                                isBlue ? "left-[120%]" : "left-[-60%]",
                                            ].join(" ")}
                                        />
                                    </span>
                                </span>

                                <span className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                                    <span className="grid h-5 w-5 place-items-center rounded-full bg-white/70 overflow-hidden">
                                        <img src={BLUE_ICON} alt="Blue mode" className="h-full w-full object-cover" draggable="false" />
                                    </span>
                                    Chill
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="sm:hidden">
                        <div className="px-3 pb-3 space-y-2">
                            <div className="grid grid-cols-3 gap-2 rounded-3xl border border-[var(--soft-border)] bg-[var(--pill)] p-2 backdrop-blur">
                                <a
                                    href="#services"
                                    className={[
                                        "group/mob inline-flex items-center justify-center gap-1.5",
                                        "rounded-3xl px-3 py-2 text-[11px] font-semibold text-[var(--accent-text)]",
                                        "bg-white/60 shadow-[0_12px_26px_-22px_var(--shadow)]",
                                        "transition-all duration-200 ease-out",
                                        "hover:-translate-y-0.5 hover:bg-white",
                                        "active:translate-y-0",
                                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-white/70",
                                    ].join(" ")}
                                >
                                    <span className="transition-transform duration-200 ease-out group-hover/mob:scale-[1.07]">🌷</span>
                                    <span className="truncate">Services</span>
                                </a>

                                <a
                                    href="#gallery"
                                    className={[
                                        "group/mob inline-flex items-center justify-center gap-1.5",
                                        "rounded-3xl px-3 py-2 text-[11px] font-semibold text-[var(--accent-text)]",
                                        "bg-white/60 shadow-[0_12px_26px_-22px_var(--shadow)]",
                                        "transition-all duration-200 ease-out",
                                        "hover:-translate-y-0.5 hover:bg-white",
                                        "active:translate-y-0",
                                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-white/70",
                                    ].join(" ")}
                                >
                                    <span className="transition-transform duration-200 ease-out group-hover/mob:scale-[1.07]">✨</span>
                                    <span className="truncate">Gallery</span>
                                </a>

                                <a
                                    href="#contact"
                                    className={[
                                        "group/mob inline-flex items-center justify-center gap-1.5",
                                        "rounded-3xl px-3 py-2 text-[11px] font-semibold text-[var(--accent-text)]",
                                        "bg-white/60 shadow-[0_12px_26px_-22px_var(--shadow)]",
                                        "transition-all duration-200 ease-out",
                                        "hover:-translate-y-0.5 hover:bg-white",
                                        "active:translate-y-0",
                                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-white/70",
                                    ].join(" ")}
                                >
                                    <span className="transition-transform duration-200 ease-out group-hover/mob:scale-[1.07]">💞</span>
                                    <span className="truncate">Contact</span>
                                </a>
                            </div>

                            <button
                                type="button"
                                onClick={toggleTheme}
                                className={[
                                    "w-full inline-flex items-center justify-between gap-3",
                                    "rounded-3xl border border-[var(--soft-border)] bg-[var(--pill)] px-4 py-2",
                                    "text-xs font-semibold text-slate-700",
                                    "shadow-[0_12px_26px_-22px_var(--shadow)] backdrop-blur",
                                    "transition-all duration-200 ease-out",
                                    "hover:-translate-y-0.5 hover:bg-[var(--pill-strong)]",
                                    "active:translate-y-0",
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-white/70",
                                ].join(" ")}
                                role="switch"
                                aria-checked={isBlue}
                                aria-label="Toggle theme"
                            >
                                <span className="inline-flex items-center gap-2 min-w-0">
                                    <span className="grid h-5 w-5 place-items-center rounded-full bg-white/70 overflow-hidden shrink-0">
                                        <img
                                            src={isBlue ? BLUE_ICON : RED_ICON}
                                            alt={isBlue ? "Blue mode" : "Red mode"}
                                            className="h-full w-full object-cover"
                                            draggable="false"
                                        />
                                    </span>
                                    <span className="truncate">{isBlue ? "Blue Mode" : "Red Mode"}</span>
                                </span>

                                <span className="relative inline-flex h-7 w-12 items-center rounded-full bg-white/70 ring-1 ring-[var(--soft-border)] shrink-0">
                                    <span
                                        className={[
                                            "pointer-events-none absolute left-1 top-1 grid h-5 w-5 place-items-center rounded-full",
                                            "bg-white/80 shadow-sm overflow-hidden",
                                            "transition-transform duration-200 ease-out",
                                            isBlue ? "translate-x-5" : "translate-x-0",
                                        ].join(" ")}
                                    >
                                        <img src={KNOB_ICON} alt="Toggle" className="h-full w-full object-cover" draggable="false" />
                                    </span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
