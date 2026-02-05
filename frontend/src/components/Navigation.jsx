// components/Navigation.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "../App";

export default function Navigation() {
    const [scrolled, setScrolled] = useState(false);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [overlayOpen, setOverlayOpen] = useState(() => localStorage.getItem("jex_overlay_open") === "1");

    const [choice, setChoice] = useState(() => localStorage.getItem("jex_can_i_choice") || "none");
    const [noStep, setNoStep] = useState(() => Number(localStorage.getItem("jex_can_i_no_step") || "0"));

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

    useEffect(() => {
        if (!overlayOpen) return;
        const prevHtml = document.documentElement.style.overflow;
        const prevBody = document.body.style.overflow;
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        return () => {
            document.documentElement.style.overflow = prevHtml;
            document.body.style.overflow = prevBody;
        };
    }, [overlayOpen]);

    useEffect(() => {
        localStorage.setItem("jex_can_i_choice", choice);
    }, [choice]);

    useEffect(() => {
        localStorage.setItem("jex_can_i_no_step", String(noStep));
    }, [noStep]);

    const openOverlay = () => {
        localStorage.setItem("jex_overlay_open", "1");
        window.dispatchEvent(new Event("jex_overlay_open"));
    };

    const closeOverlay = () => {
        localStorage.setItem("jex_overlay_open", "0");
        window.dispatchEvent(new Event("jex_overlay_close"));
    };

    const resetCanI = () => {
        setChoice("none");
        setNoStep(0);
        localStorage.setItem("jex_can_i_choice", "none");
        localStorage.setItem("jex_can_i_no_step", "0");
    };

    const navItems = useMemo(
        () => [
            { label: "Will You?", href: "#can-i" },
            { label: "Gallery", href: "#gallery" },
            { label: "Message", href: "#message" },
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

    const CAN_I_DEFAULT = "/jexhappy.png";
    const CAN_I_YES = "/jex2.png";
    const CAN_I_NO = "/jexsad.png";

    const YES_ICON = "/yes.png";
    const NO_ICON = "/no.png";

    const noLabels = useMemo(
        () => ["No", "Are you sure?", "Are you really sure?", "Really really sure?", "Last Chance?", "But.."],
        []
    );

    const yesMessage = useMemo(
        () => ({
            title: "Thankyou so much! Adoy.",
            body: "Alam ko naman na malayo ka, so aayain na lang kita mag laro ng ml, roblox, or any. Kung hindi lang ikaw busy po. Yun lang po adooyyy! Thankyouuuuu :)",
        }),
        []
    );

    const noMessage = useMemo(
        () => ({
            title: "Oh no… 🥺",
            body: "Please don’t say no… just tap “Yes” 🫶",
        }),
        []
    );

    const overlayImage = choice === "yes" ? CAN_I_YES : choice === "no" ? CAN_I_NO : CAN_I_DEFAULT;

    const sideMessage = choice === "yes" ? yesMessage : null;

    const showNoButton = !(choice === "no" && noStep >= 5);

    const noLabel = noLabels[Math.min(noStep, noLabels.length - 1)];

    const onYes = () => {
        setChoice("yes");
        setNoStep(0);
    };

    const onNo = () => {
        setChoice("no");
        setNoStep((s) => Math.min(s + 1, 5));
    };

    if (overlayOpen) {
        const isDefault = choice === "none";
        const isNo = choice === "no";

        return (
            <div
                className="fixed inset-0 z-[999] font-['Poppins']"
                role="dialog"
                aria-modal="true"
                aria-label="Can I overlay"
                onClick={closeOverlay}
            >
                <div className="absolute inset-0 bg-black/30 backdrop-blur-md" aria-hidden="true" />

                <div className="relative z-10 min-h-[100svh] w-full px-4 py-6 sm:py-10 flex items-center justify-center">
                    <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
                        <div className="mx-auto max-w-xl text-center">
                            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-[11px] font-semibold tracking-wide text-white/85">
                                <span className="grid h-5 w-5 place-items-center rounded-full bg-white/15">💘</span>
                                Valentine Question
                            </div>

                            <p className="mt-4 text-[22px] sm:text-[32px] leading-tight font-black tracking-tight text-white drop-shadow-[0_10px_24px_rgba(0,0,0,0.35)]">
                                Will You Be My Valentine?
                            </p>

                            <p className="mt-2 text-[12px] sm:text-sm font-medium text-white/80">Just one click… and you’ll make my day.</p>
                        </div>

                        <div
                            className={[
                                "mt-5 grid gap-4 md:gap-6 items-center",
                                isDefault || isNo ? "grid-cols-1" : "grid-cols-1 md:grid-cols-[minmax(0,520px)_minmax(0,1fr)]",
                            ].join(" ")}
                        >
                            <div className="mx-auto w-full max-w-[520px] grid place-items-center" onClick={(e) => e.stopPropagation()}>
                                <img
                                    src={overlayImage}
                                    alt="Valentine"
                                    className="h-auto w-full max-w-[min(480px,86vw)] object-contain select-none"
                                    draggable="false"
                                />
                            </div>

                            {!isDefault && !isNo && (
                                <div
                                    className={[
                                        "relative mx-auto w-full max-w-xl",
                                        "rounded-3xl border border-white/18 bg-white/12",
                                        "backdrop-blur-md",
                                        "p-4 sm:p-5",
                                        "text-white",
                                        "shadow-[0_22px_60px_-45px_rgba(0,0,0,0.85)]",
                                        sideMessage ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none",
                                        "transition-all duration-300 ease-out",
                                        "after:content-[''] after:absolute after:-left-3 after:top-9 after:border-y-[12px] after:border-y-transparent after:border-r-[16px] after:border-r-white/12",
                                        "before:content-[''] before:absolute before:-left-[13px] before:top-9 before:border-y-[12px] before:border-y-transparent before:border-r-[16px] before:border-r-white/18",
                                    ].join(" ")}
                                    onClick={(e) => e.stopPropagation()}
                                    aria-hidden={!sideMessage}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex items-start gap-3">
                                            <div className="min-w-0">
                                                <p className="text-base sm:text-lg font-extrabold tracking-tight">{sideMessage?.title || ""}</p>
                                                <p className="mt-1 text-[12px] sm:text-sm text-white/85 leading-relaxed">{sideMessage?.body || ""}</p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={resetCanI}
                                            className={[
                                                "shrink-0 rounded-2xl px-3 py-2",
                                                "text-[11px] font-semibold text-white/85",
                                                "bg-white/10 ring-1 ring-white/20",
                                                "hover:bg-white/14",
                                                "transition-all duration-200 ease-out",
                                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                                            ].join(" ")}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mx-auto w-full max-w-xl mt-[-30px] sm:mt-[-70px]" onClick={(e) => e.stopPropagation()}>
                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                <button
                                    type="button"
                                    onClick={onYes}
                                    className={[
                                        "group relative overflow-hidden",
                                        "inline-flex items-center justify-center gap-2",
                                        "rounded-3xl px-6 py-3 text-sm sm:text-base font-extrabold",
                                        "text-slate-900 bg-white",
                                        "shadow-[0_22px_55px_-40px_rgba(0,0,0,0.8)]",
                                        "transition-all duration-200 ease-out",
                                        "hover:-translate-y-0.5 active:translate-y-0",
                                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                                    ].join(" ")}
                                >
                                    <span className="relative h-5 w-5">
                                        <img src={YES_ICON} alt="Yes" className="h-full w-full object-contain" draggable="false" />
                                    </span>
                                    <span className="relative">Yes</span>
                                </button>

                                {showNoButton ? (
                                    <button
                                        type="button"
                                        onClick={onNo}
                                        className={[
                                            "group relative overflow-hidden",
                                            "inline-flex items-center justify-center gap-2",
                                            "rounded-3xl px-6 py-3 text-sm sm:text-base font-extrabold",
                                            "text-white bg-white/12",
                                            "ring-1 ring-white/22",
                                            "shadow-[0_22px_55px_-40px_rgba(0,0,0,0.8)]",
                                            "backdrop-blur",
                                            "transition-all duration-200 ease-out",
                                            "hover:-translate-y-0.5 hover:bg-white/16",
                                            "active:translate-y-0",
                                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                                        ].join(" ")}
                                    >
                                        <span className="relative h-5 w-5 grid place-items-center">
                                            <img src={NO_ICON} alt="No" className="h-full w-full object-contain" draggable="false" />
                                        </span>

                                        <span className="relative">{noLabel}</span>
                                    </button>
                                ) : (
                                    <div className="hidden sm:block" />
                                )}
                            </div>
                        </div>

                        <div className="mt-[-70px] sm:mt-6 flex justify-center" onClick={(e) => e.stopPropagation()} />
                    </div>
                </div>
            </div>
        );
    }

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
                                <span className="truncate text-[11px] sm:text-xs text-slate-500">Happy Valentine&apos;s Day!</span>
                            </span>
                        </a>

                        <nav className="hidden items-center gap-2 sm:flex" aria-label="Primary navigation">
                            <div className="flex items-center rounded-3xl border border-[var(--soft-border)] bg-[var(--pill)] p-1 backdrop-blur transition-all duration-300 ease-out group-hover:bg-[var(--pill-strong)]">
                                {navItems.map((item) => {
                                    if (item.label === "Will You?") {
                                        return (
                                            <button
                                                key={item.label}
                                                type="button"
                                                onClick={openOverlay}
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
                                            </button>
                                        );
                                    }

                                    return (
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
                                    );
                                })}
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

                                <span className="relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full bg-white/70 ring-1 ring-[var(--soft-border)] transition-all duration-200 ease-out">
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
                                <button
                                    type="button"
                                    onClick={openOverlay}
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
                                    <span className="transition-transform duration-200 ease-out group-hover/mob:scale-[1.07]">❓</span>
                                    <span className="truncate">Will You?</span>
                                </button>

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
                                    href="#message"
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
                                    <span className="transition-transform duration-200 ease-out group-hover/mob:scale-[1.07]">💌</span>
                                    <span className="truncate">Message</span>
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
