// components/Navigation.jsx
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { ThemeContext } from "../App";

export default function Navigation() {
    const [scrolled, setScrolled] = useState(false);
    const { theme, toggleTheme } = useContext(ThemeContext);

    const [overlayOpen, setOverlayOpen] = useState(() => localStorage.getItem("jex_overlay_open") === "1");
    const [galleryOpen, setGalleryOpen] = useState(() => localStorage.getItem("jex_gallery_open") === "1");
    const [messageOpen, setMessageOpen] = useState(() => localStorage.getItem("jex_message_open") === "1");

    const [choice, setChoice] = useState(() => localStorage.getItem("jex_can_i_choice") || "none");
    const [noStep, setNoStep] = useState(() => Number(localStorage.getItem("jex_can_i_no_step") || "0"));

    const [wallName, setWallName] = useState(() => localStorage.getItem("jex_wall_name") || "");
    const [wallText, setWallText] = useState("");
    const [wallMessages, setWallMessages] = useState([]);
    const [wallLoading, setWallLoading] = useState(false);
    const [wallPosting, setWallPosting] = useState(false);
    const [wallError, setWallError] = useState("");

    const [adminKey, setAdminKey] = useState(() => localStorage.getItem("jex_wall_admin_key") || "");
    const [wallDeletingId, setWallDeletingId] = useState(null);

    const pollRef = useRef(null);

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
        const sync = () => setGalleryOpen(localStorage.getItem("jex_gallery_open") === "1");
        const onOpen = () => setGalleryOpen(true);
        const onClose = () => setGalleryOpen(false);
        const onStorage = (e) => {
            if (e.key === "jex_gallery_open") sync();
        };

        window.addEventListener("jex_gallery_open", onOpen);
        window.addEventListener("jex_gallery_close", onClose);
        window.addEventListener("storage", onStorage);

        return () => {
            window.removeEventListener("jex_gallery_open", onOpen);
            window.removeEventListener("jex_gallery_close", onClose);
            window.removeEventListener("storage", onStorage);
        };
    }, []);

    useEffect(() => {
        const sync = () => setMessageOpen(localStorage.getItem("jex_message_open") === "1");
        const onOpen = () => setMessageOpen(true);
        const onClose = () => setMessageOpen(false);
        const onStorage = (e) => {
            if (e.key === "jex_message_open") sync();
        };

        window.addEventListener("jex_message_open", onOpen);
        window.addEventListener("jex_message_close", onClose);
        window.addEventListener("storage", onStorage);

        return () => {
            window.removeEventListener("jex_message_open", onOpen);
            window.removeEventListener("jex_message_close", onClose);
            window.removeEventListener("storage", onStorage);
        };
    }, []);

    useEffect(() => {
        if (!overlayOpen && !galleryOpen && !messageOpen) return;
        const prevHtml = document.documentElement.style.overflow;
        const prevBody = document.body.style.overflow;
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        return () => {
            document.documentElement.style.overflow = prevHtml;
            document.body.style.overflow = prevBody;
        };
    }, [overlayOpen, galleryOpen, messageOpen]);

    useEffect(() => {
        localStorage.setItem("jex_can_i_choice", choice);
    }, [choice]);

    useEffect(() => {
        localStorage.setItem("jex_can_i_no_step", String(noStep));
    }, [noStep]);

    useEffect(() => {
        localStorage.setItem("jex_wall_name", wallName);
    }, [wallName]);

    useEffect(() => {
        localStorage.setItem("jex_wall_admin_key", adminKey);
    }, [adminKey]);

    const openOverlay = () => {
        localStorage.setItem("jex_overlay_open", "1");
        window.dispatchEvent(new Event("jex_overlay_open"));
    };

    const closeOverlay = () => {
        localStorage.setItem("jex_overlay_open", "0");
        window.dispatchEvent(new Event("jex_overlay_close"));
    };

    const openGalleryOverlay = () => {
        localStorage.setItem("jex_gallery_open", "1");
        window.dispatchEvent(new Event("jex_gallery_open"));
    };

    const closeGalleryOverlay = () => {
        localStorage.setItem("jex_gallery_open", "0");
        window.dispatchEvent(new Event("jex_gallery_close"));
    };

    const openMessageOverlay = () => {
        localStorage.setItem("jex_message_open", "1");
        window.dispatchEvent(new Event("jex_message_open"));
    };

    const closeMessageOverlay = () => {
        localStorage.setItem("jex_message_open", "0");
        window.dispatchEvent(new Event("jex_message_close"));
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

    const GALLERY_PHOTOS = useMemo(
        () => [
            { src: "/us1.png", alt: "Us 1", rot: "-rotate-2", tape: "left-6 -top-3 rotate-[-10deg]" },
            { src: "/us2.png", alt: "Us 2", rot: "rotate-1", tape: "right-8 -top-3 rotate-[12deg]" },
            { src: "/us3.png", alt: "Us 3", rot: "-rotate-1", tape: "left-10 -top-3 rotate-[8deg]" },
            { src: "/us4.png", alt: "Us 4", rot: "rotate-2", tape: "right-10 -top-3 rotate-[-8deg]" },
            { src: "/us5.png", alt: "Us 5", rot: "-rotate-2", tape: "left-7 -top-3 rotate-[14deg]" },
            { src: "/us6.png", alt: "Us 6", rot: "rotate-1", tape: "right-6 -top-3 rotate-[-12deg]" },
        ],
        []
    );

    const fetchWall = async ({ silent = false } = {}) => {
        if (!silent) setWallLoading(true);
        setWallError("");
        try {
            const res = await fetch("/api/messages", { method: "GET" });
            if (!res.ok) throw new Error("Failed to load messages.");
            const data = await res.json();
            setWallMessages(Array.isArray(data?.messages) ? data.messages : []);
        } catch (e) {
            if (!silent) setWallError("Could not load the Freedom Wall right now.");
        } finally {
            if (!silent) setWallLoading(false);
        }
    };

    useEffect(() => {
        if (!messageOpen) {
            if (pollRef.current) {
                clearInterval(pollRef.current);
                pollRef.current = null;
            }
            return;
        }

        fetchWall();
        pollRef.current = setInterval(() => fetchWall({ silent: true }), 5000);

        return () => {
            if (pollRef.current) {
                clearInterval(pollRef.current);
                pollRef.current = null;
            }
        };
    }, [messageOpen]);

    const postWall = async () => {
        const name = (wallName || "").trim();
        const text = (wallText || "").trim();
        if (!text) return;

        setWallPosting(true);
        setWallError("");

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, text }),
            });
            if (!res.ok) throw new Error("Failed to post.");
            setWallText("");
            await fetchWall({ silent: true });
        } catch (e) {
            setWallError("Could not post your message. Try again.");
        } finally {
            setWallPosting(false);
        }
    };

    const deleteWall = async (id) => {
        if (!adminKey) return;
        setWallDeletingId(id);
        setWallError("");
        try {
            const res = await fetch(`/api/messages?id=${encodeURIComponent(id)}`, {
                method: "DELETE",
                headers: { "x-admin-key": adminKey },
            });
            if (!res.ok) throw new Error("Failed to delete.");
            await fetchWall({ silent: true });
        } catch (e) {
            setWallError("Could not delete the message. Check your admin key.");
        } finally {
            setWallDeletingId(null);
        }
    };

    const onWallKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            postWall();
        }
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

                            <p className="mt-2 text-[12px] sm:text-sm font-medium text-white/80">
                                Just one click… and you’ll make my day.
                            </p>
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

    if (galleryOpen) {
        return (
            <div
                className="fixed inset-0 z-[999] font-['Poppins']"
                role="dialog"
                aria-modal="true"
                aria-label="Gallery overlay"
                onClick={closeGalleryOverlay}
            >
                <div className="absolute inset-0 bg-black/30 backdrop-blur-md" aria-hidden="true" />

                <div className="relative z-10 min-h-[100svh] w-full px-4 py-6 sm:py-10 flex items-center justify-center">
                    <div className="w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
                        <div className="mx-auto max-w-2xl text-center">
                            <p className="mt-4 text-[22px] sm:text-[34px] leading-tight font-black tracking-tight text-white drop-shadow-[0_10px_24px_rgba(0,0,0,0.35)]">
                                Memories Gallery
                            </p>

                            <p className="mt-2 text-[12px] sm:text-sm font-medium text-white/80">
                                Still cherishing the memories we&apos;ve made together.
                            </p>
                        </div>

                        <div className="mt-6 sm:mt-8">
                            <div className="relative mx-auto w-full max-w-6xl">
                                <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.55]">
                                    <div className="absolute -top-10 left-1/2 h-64 w-[46rem] -translate-x-1/2 rounded-full bg-white/18 blur-3xl" />
                                    <div className="absolute -bottom-10 right-0 h-64 w-[40rem] rounded-full bg-white/14 blur-3xl" />
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
                                    {GALLERY_PHOTOS.map((p, i) => (
                                        <div
                                            key={`${p.src}-${i}`}
                                            className={[
                                                "relative",
                                                "rounded-[26px]",
                                                "border border-white/18",
                                                "bg-white/10",
                                                "backdrop-blur-md",
                                                "shadow-[0_22px_60px_-45px_rgba(0,0,0,0.85)]",
                                                "p-2 sm:p-3",
                                                "transition-transform duration-200 ease-out",
                                                "hover:-translate-y-0.5",
                                                p.rot,
                                            ].join(" ")}
                                        >
                                            <div
                                                className={[
                                                    "pointer-events-none absolute",
                                                    "h-7 w-20 sm:h-8 sm:w-24",
                                                    "rounded-full",
                                                    "bg-white/22",
                                                    "ring-1 ring-white/28",
                                                    "backdrop-blur",
                                                    "shadow-[0_10px_30px_-20px_rgba(0,0,0,0.9)]",
                                                    p.tape,
                                                ].join(" ")}
                                            />

                                            <div className="relative overflow-hidden rounded-[22px] bg-white/70">
                                                <div className="pointer-events-none absolute inset-0 opacity-[0.28]">
                                                    <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-rose-200/60 blur-2xl" />
                                                    <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-pink-200/60 blur-2xl" />
                                                </div>

                                                <div className="relative p-2 sm:p-2.5">
                                                    <div className="relative overflow-hidden rounded-[18px]">
                                                        <img
                                                            src={p.src}
                                                            alt={p.alt}
                                                            className="h-44 sm:h-56 md:h-60 w-full object-cover select-none"
                                                            draggable="false"
                                                        />
                                                    </div>

                                                    <div className="mt-2 flex items-center justify-between">
                                                        <div className="min-w-0">
                                                            <p className="truncate text-[11px] sm:text-xs font-extrabold tracking-tight text-slate-900">
                                                                Better days with you
                                                            </p>
                                                            <p className="truncate text-[10px] sm:text-[11px] text-slate-500">
                                                                just having fun together
                                                            </p>
                                                        </div>

                                                        <span className="shrink-0 grid h-8 w-8 place-items-center rounded-2xl bg-white/75 ring-1 ring-rose-200/60 text-[13px]">
                                                            💞
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="pointer-events-none absolute -bottom-2 left-0 right-0 h-10 opacity-[0.45]">
                                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(255,255,255,0.85),transparent_55%),radial-gradient(circle_at_45%_0%,rgba(255,255,255,0.85),transparent_55%),radial-gradient(circle_at_75%_0%,rgba(255,255,255,0.85),transparent_55%)]" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 sm:mt-8 flex justify-center">
                            <button
                                type="button"
                                onClick={closeGalleryOverlay}
                                className={[
                                    "inline-flex items-center justify-center gap-2",
                                    "rounded-3xl px-5 py-2.5",
                                    "text-sm font-extrabold",
                                    "text-slate-900 bg-white",
                                    "shadow-[0_22px_55px_-40px_rgba(0,0,0,0.8)]",
                                    "transition-all duration-200 ease-out",
                                    "hover:-translate-y-0.5 active:translate-y-0",
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                                ].join(" ")}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (messageOpen) {
        return (
            <div
                className="fixed inset-0 z-[999] font-['Poppins']"
                role="dialog"
                aria-modal="true"
                aria-label="Message overlay"
                onClick={closeMessageOverlay}
            >
                <div className="absolute inset-0 bg-black/30 backdrop-blur-md" aria-hidden="true" />

                <div className="relative z-10 min-h-[100svh] w-full px-4 py-6 sm:py-10 flex items-center justify-center">
                    <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
                        <div className="mx-auto max-w-2xl text-center">
                            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-[11px] font-semibold tracking-wide text-white/85">
                                <span className="grid h-5 w-5 place-items-center rounded-full bg-white/15">🧸</span>
                                Freedom Wall
                            </div>

                            <p className="mt-4 text-[22px] sm:text-[34px] leading-tight font-black tracking-tight text-white drop-shadow-[0_10px_24px_rgba(0,0,0,0.35)]">
                                Leave a message for each other
                            </p>

                            <p className="mt-2 text-[12px] sm:text-sm font-medium text-white/80">
                                Post something sweet, funny, or random. Everyone can see it.
                            </p>
                        </div>

                        <div className="mt-6 sm:mt-8 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,360px)] items-start">
                            <div
                                className={[
                                    "rounded-3xl border border-white/18 bg-white/12 backdrop-blur-md",
                                    "shadow-[0_22px_60px_-45px_rgba(0,0,0,0.85)]",
                                    "overflow-hidden",
                                ].join(" ")}
                            >
                                <div className="flex items-center justify-between gap-2 px-4 sm:px-5 py-3 border-b border-white/12">
                                    <div className="min-w-0">
                                        <p className="text-white font-extrabold tracking-tight">Wall Posts</p>
                                        <p className="text-white/70 text-[11px] sm:text-xs">Auto-refresh every 5 seconds</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => fetchWall()}
                                            className={[
                                                "rounded-2xl px-3 py-2",
                                                "text-[11px] font-semibold text-white/85",
                                                "bg-white/10 ring-1 ring-white/20",
                                                "hover:bg-white/14",
                                                "transition-all duration-200 ease-out",
                                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                                            ].join(" ")}
                                        >
                                            Refresh
                                        </button>

                                        <button
                                            type="button"
                                            onClick={closeMessageOverlay}
                                            className={[
                                                "rounded-2xl px-3 py-2",
                                                "text-[11px] font-semibold text-white/85",
                                                "bg-white/10 ring-1 ring-white/20",
                                                "hover:bg-white/14",
                                                "transition-all duration-200 ease-out",
                                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                                            ].join(" ")}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>

                                <div className="p-3 sm:p-4">
                                    {wallError ? (
                                        <div className="rounded-3xl bg-white/10 ring-1 ring-white/18 p-4 text-center text-white/85 text-sm font-semibold">
                                            {wallError}
                                        </div>
                                    ) : wallLoading ? (
                                        <div className="rounded-3xl bg-white/10 ring-1 ring-white/18 p-5 text-center text-white/80 text-sm font-semibold">
                                            Loading messages…
                                        </div>
                                    ) : wallMessages.length === 0 ? (
                                        <div className="rounded-3xl bg-white/10 ring-1 ring-white/18 p-5 text-center text-white/80 text-sm font-semibold">
                                            No messages yet. Be the first 🫶
                                        </div>
                                    ) : (
                                        <div className="max-h-[58svh] overflow-auto pr-1">
                                            <div className="grid gap-2.5">
                                                {wallMessages.map((m) => (
                                                    <div
                                                        key={m.id}
                                                        className={[
                                                            "rounded-3xl bg-white/10 ring-1 ring-white/18",
                                                            "p-4",
                                                            "shadow-[0_18px_50px_-40px_rgba(0,0,0,0.85)]",
                                                        ].join(" ")}
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="min-w-0">
                                                                <p className="text-white font-extrabold text-sm tracking-tight truncate">
                                                                    {m.name ? m.name : "Anonymous"}
                                                                </p>
                                                                <p className="mt-2 text-white/90 text-sm leading-relaxed whitespace-pre-wrap break-words">
                                                                    {m.text}
                                                                </p>
                                                            </div>

                                                            <div className="shrink-0 flex items-center gap-2">
                                                                {adminKey ? (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => deleteWall(m.id)}
                                                                        disabled={wallDeletingId === m.id}
                                                                        className={[
                                                                            "rounded-2xl px-3 py-2",
                                                                            "text-[11px] font-semibold text-white/85",
                                                                            "bg-white/10 ring-1 ring-white/20",
                                                                            "hover:bg-white/14",
                                                                            "transition-all duration-200 ease-out",
                                                                            "disabled:opacity-60 disabled:cursor-not-allowed",
                                                                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                                                                        ].join(" ")}
                                                                    >
                                                                        {wallDeletingId === m.id ? "Deleting…" : "Delete"}
                                                                    </button>
                                                                ) : null}

                                                                <span className="grid h-8 w-8 place-items-center rounded-2xl bg-white/12 ring-1 ring-white/18 text-[13px]">
                                                                    💌
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <p className="mt-3 text-white/60 text-[10px] sm:text-[11px] font-semibold">
                                                            {m.ts ? new Date(m.ts).toLocaleString() : ""}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div
                                className={[
                                    "rounded-3xl border border-white/18 bg-white/12 backdrop-blur-md",
                                    "shadow-[0_22px_60px_-45px_rgba(0,0,0,0.85)]",
                                    "p-4 sm:p-5",
                                ].join(" ")}
                            >
                                <p className="text-white font-extrabold tracking-tight">Write a post</p>
                                <p className="mt-1 text-white/70 text-[11px] sm:text-xs font-semibold">
                                    Tip: Ctrl/⌘ + Enter to send
                                </p>

                                <label className="mt-4 block">
                                    <span className="block text-white/80 text-xs font-semibold">Name (optional)</span>
                                    <input
                                        value={wallName}
                                        onChange={(e) => setWallName(e.target.value)}
                                        placeholder="e.g. Adoy"
                                        className={[
                                            "mt-2 w-full",
                                            "rounded-2xl px-4 py-2.5",
                                            "bg-white/10 text-white placeholder:text-white/45",
                                            "ring-1 ring-white/18",
                                            "focus:outline-none focus:ring-2 focus:ring-white/70",
                                            "text-sm font-semibold",
                                        ].join(" ")}
                                    />
                                </label>

                                <label className="mt-4 block">
                                    <span className="block text-white/80 text-xs font-semibold">Message</span>
                                    <textarea
                                        value={wallText}
                                        onChange={(e) => setWallText(e.target.value)}
                                        onKeyDown={onWallKeyDown}
                                        placeholder="Write something…"
                                        rows={5}
                                        className={[
                                            "mt-2 w-full resize-none",
                                            "rounded-2xl px-4 py-3",
                                            "bg-white/10 text-white placeholder:text-white/45",
                                            "ring-1 ring-white/18",
                                            "focus:outline-none focus:ring-2 focus:ring-white/70",
                                            "text-sm font-semibold leading-relaxed",
                                        ].join(" ")}
                                    />
                                </label>

                                <label className="mt-4 block">
                                    <span className="block text-white/80 text-xs font-semibold">Admin key (only for you)</span>
                                    <input
                                        value={adminKey}
                                        onChange={(e) => setAdminKey(e.target.value)}
                                        placeholder="Paste your admin key"
                                        className={[
                                            "mt-2 w-full",
                                            "rounded-2xl px-4 py-2.5",
                                            "bg-white/10 text-white placeholder:text-white/45",
                                            "ring-1 ring-white/18",
                                            "focus:outline-none focus:ring-2 focus:ring-white/70",
                                            "text-sm font-semibold",
                                        ].join(" ")}
                                    />
                                </label>

                                <button
                                    type="button"
                                    onClick={postWall}
                                    disabled={wallPosting || !(wallText || "").trim()}
                                    className={[
                                        "mt-4 w-full inline-flex items-center justify-center gap-2",
                                        "rounded-3xl px-5 py-3",
                                        "text-sm font-extrabold",
                                        "text-slate-900 bg-white",
                                        "shadow-[0_22px_55px_-40px_rgba(0,0,0,0.8)]",
                                        "transition-all duration-200 ease-out",
                                        "hover:-translate-y-0.5 active:translate-y-0",
                                        "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0",
                                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                                    ].join(" ")}
                                >
                                    <span className="grid h-5 w-5 place-items-center rounded-full bg-black/5">📨</span>
                                    {wallPosting ? "Posting…" : "Post Message"}
                                </button>

                                <div className="mt-3 rounded-2xl bg-white/8 ring-1 ring-white/14 p-3">
                                    <p className="text-white/80 text-[11px] font-semibold leading-relaxed">
                                        This is shared for everyone who visits your site. Keep it nice 🫶
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <button
                                type="button"
                                onClick={closeMessageOverlay}
                                className={[
                                    "inline-flex items-center justify-center gap-2",
                                    "rounded-3xl px-5 py-2.5",
                                    "text-sm font-extrabold",
                                    "text-white bg-white/12 ring-1 ring-white/22",
                                    "shadow-[0_22px_55px_-40px_rgba(0,0,0,0.8)]",
                                    "backdrop-blur",
                                    "transition-all duration-200 ease-out",
                                    "hover:-translate-y-0.5 hover:bg-white/16",
                                    "active:translate-y-0",
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                                ].join(" ")}
                            >
                                Close
                            </button>
                        </div>
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

                                    if (item.label === "Gallery") {
                                        return (
                                            <button
                                                key={item.label}
                                                type="button"
                                                onClick={openGalleryOverlay}
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

                                    if (item.label === "Message") {
                                        return (
                                            <button
                                                key={item.label}
                                                type="button"
                                                onClick={openMessageOverlay}
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

                                <button
                                    type="button"
                                    onClick={openGalleryOverlay}
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
                                </button>

                                <button
                                    type="button"
                                    onClick={openMessageOverlay}
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
                                </button>
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
