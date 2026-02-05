// components/Footer.jsx
import React, { useEffect, useState } from "react";

export default function Footer() {
    const year = new Date().getFullYear();
    const [overlayOpen, setOverlayOpen] = useState(() => localStorage.getItem("jex_overlay_open") === "1");

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

    if (overlayOpen) return null;

    return (
        <footer className="relative isolate overflow-hidden font-['Poppins'] -mt-px">
            <div className="absolute inset-0 -z-10 bg-[var(--bg-via)]" />

            <div className="mx-auto w-full max-w-300 px-4 sm:px-6 pb-10 pt-10 sm:pt-14">
                <div className="rounded-4xl border border-[var(--soft-border)] bg-[var(--panel)] p-5 sm:p-8 shadow-sm backdrop-blur">
                    <div className="flex flex-col items-start justify-between gap-3 text-sm text-slate-600 sm:flex-row sm:items-center">
                        <div className="inline-flex items-center gap-2">
                            <span className="text-[13px] sm:text-sm">
                                © {year} <span className="font-semibold text-slate-900">FEBRUARY 14</span>. For Aila Medel Only.
                            </span>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--soft-border)] bg-[var(--pill)] px-4 py-2 text-xs font-semibold text-[var(--accent-text)] shadow-sm backdrop-blur">
                            <span className="text-sm">💞</span> Made by Jexter with love
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
