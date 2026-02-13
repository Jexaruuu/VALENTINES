import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ThemeContext } from "../App";

export default function Hero() {
    const { theme } = useContext(ThemeContext);
    const isBlue = theme === "blue";

    const CARD_BACK_IMG = "/heart.gif";

    const BADGE_RED_ICON = "/blush.gif";
    const BADGE_BLUE_ICON = "/chill.gif";
    const BADGE_ICON = isBlue ? BADGE_BLUE_ICON : BADGE_RED_ICON;

    const NEW_GAME_ICON = "/restart.png";
    const ENVELOPE_ICON = "/loveletter.gif";

    const PREV_ICON = "/prev.png";
    const NEXT_ICON = "/next.png";
    const VOLUME_ICON = "/volume.png";

    const MATCH_SFX = "/match.mp3";

    const SYMBOLS = useMemo(
        () => [
            { key: "yoda", label: "Yoda", img: "/yoda.gif" },
            { key: "capybara", label: "Capybara", img: "/capybara.gif" },
            { key: "full moon", label: "Full Moon", img: "/fullmoon.gif" },
            { key: "coffee", label: "Coffee", img: "/coffee.gif" },
            { key: "cat", label: "Cat", img: "/cat.gif" },
            { key: "ice cream", label: "Ice Cream", img: "/cookiesandcream.png" },
            { key: "miles", label: "Miles", img: "/miles.gif" },
            { key: "gwen", label: "Gwen", img: "/gwen.gif" },
        ],
        []
    );

    const TRACKS = useMemo(
        () => [
            {
                id: "valentine-0.5",
                title: "Bughaw",
                artist: "Maki",
                cover: "/bughaw.png",
                src: "/MAKI - Bughaw.mp3",
            },
            {
                id: "valentine-0.1",
                title: "Dilaw",
                artist: "Maki",
                cover: "/dilaw.png",
                src: "/MAKI - Dilaw.mp3",
            },
            {
                id: "valentine-0",
                title: "Kahel Na Langit",
                artist: "Maki",
                cover: "/kahelnalangit.jpg",
                src: "/MAKI - Kahel na Langit.mp3",
            },
            {
                id: "valentine-00",
                title: "Paralisado",
                artist: "Arthur Nery & Adie",
                cover: "/paralisado.jpg",
                src: "/ARTHUR NERY - Paralisado.mp3",
            },
            {
                id: "valentine-1",
                title: "Disney Movie",
                artist: "John Michael Howell & ZVC",
                cover: "/disneymovie.jpg",
                src: "/John Michael Howell & ZVC - Disney Movie.mp3",
            },
            {
                id: "valentine-2",
                title: "Pwede Ka Ba?",
                artist: "Frank Ely",
                cover: "/pwedekaba.jpg",
                src: "/FRANK ELY - Pwede Ka Ba.mp3",
            },
            {
                id: "valentine-3",
                title: "I Like Her",
                artist: "J3RO",
                cover: "/ilikeher.jpg",
                src: "/J3R0 - I Like Her.mp3",
            },
            {
                id: "valentine-4",
                title: "My Unsent Love Letter",
                artist: "Aira",
                cover: "/myunsentloveletter.png",
                src: "/my unsent love letter - aira.mp3",
            },
            {
                id: "valentine-5",
                title: "Call U Mine",
                artist: "J3RO",
                cover: "/callumine.jpg",
                src: "/J3R0 - Call U Mine.mp3",
            },
            {
                id: "valentine-6",
                title: "Feeling This Way",
                artist: "J3RO",
                cover: "/feelingthisway.jpg",
                src: "/J3R0 - Feeling This Way.mp3",
            },
            {
                id: "valentine-7",
                title: "Honestly, Maybe",
                artist: "Kanegi",
                cover: "/honestlymaybe.jpg",
                src: "/kanegi. - honestly, maybe.mp3",
            },
            {
                id: "valentine-8",
                title: "Only U",
                artist: "J3RO",
                cover: "/onlyu.jpg",
                src: "/J3RO - Only U.mp3",
            },
            {
                id: "valentine-9",
                title: "Sunsets With You",
                artist: "Cliff, Yden",
                cover: "/sunsetswithyou.jpg",
                src: "/Sunsets With You - Cliff, Yden.mp3",
            },
            {
                id: "valentine-10",
                title: "Ayaw Kitang Mawala",
                artist: "Lirio",
                cover: "/ayawkitangmawala.jpg",
                src: "/Ayaw kitang mawala - Lirio.mp3",
            },
        ],
        [isBlue]
    );

    const buildDeck = () => {
        const doubled = [...SYMBOLS, ...SYMBOLS].map((s, idx) => ({
            id: `${s.key}-${idx}-${Math.random().toString(16).slice(2)}`,
            pairKey: s.key,
            img: s.img,
            label: s.label,
        }));

        for (let i = doubled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
        }

        return doubled.map((c) => ({
            ...c,
            faceUp: false,
            matched: false,
        }));
    };

    const [deck, setDeck] = useState(() => buildDeck());
    const deckRef = useRef(deck);

    const [firstPick, setFirstPick] = useState(null);
    const [secondPick, setSecondPick] = useState(null);
    const [lock, setLock] = useState(false);
    const [moves, setMoves] = useState(0);
    const [score, setScore] = useState(0);
    const [best, setBest] = useState(0);
    const [justMatchedKey, setJustMatchedKey] = useState(null);

    const allMatched = useMemo(() => deck.every((c) => c.matched), [deck]);
    const unlocked = allMatched;

    const [envelopeOpen, setEnvelopeOpen] = useState(false);
    const [valentineOpen, setValentineOpen] = useState(false);

    const confettiRef = useRef(null);
    const rafRef = useRef(null);

    const matchTimerRef = useRef(null);
    const clearTimerRef = useRef(null);
    const glowTimerRef = useRef(null);

    const firstPickRef = useRef(firstPick);
    const secondPickRef = useRef(secondPick);
    const lockRef = useRef(lock);

    const [elapsedMs, setElapsedMs] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const timerRunningRef = useRef(timerRunning);
    const elapsedRef = useRef(elapsedMs);

    const [heartBursts, setHeartBursts] = useState([]);
    const burstIdRef = useRef(1);
    const burstTimerRef = useRef(null);
    const boardRef = useRef(null);

    const sfxRef = useRef(null);

    const autoOpenTimerRef = useRef(null);

    useEffect(() => {
        sfxRef.current = new Audio(MATCH_SFX);
        sfxRef.current.preload = "auto";
        sfxRef.current.volume = 0.85;
    }, []);

    useEffect(() => {
        deckRef.current = deck;
    }, [deck]);

    useEffect(() => {
        firstPickRef.current = firstPick;
    }, [firstPick]);

    useEffect(() => {
        secondPickRef.current = secondPick;
    }, [secondPick]);

    useEffect(() => {
        lockRef.current = lock;
    }, [lock]);

    useEffect(() => {
        timerRunningRef.current = timerRunning;
    }, [timerRunning]);

    useEffect(() => {
        elapsedRef.current = elapsedMs;
    }, [elapsedMs]);

    useEffect(() => {
        const savedBest = Number(localStorage.getItem("valentine_match_best") || "0");
        if (Number.isFinite(savedBest)) setBest(savedBest);
    }, []);

    useEffect(() => {
        localStorage.setItem("valentine_match_best", String(best));
    }, [best]);

    useEffect(() => {
        if (!unlocked) return;
        localStorage.setItem("valentine_match_unlocked", "1");
        window.dispatchEvent(new Event("valentine_match_unlocked"));
        setTimerRunning(false);
    }, [unlocked]);

    useEffect(() => {
        if (!timerRunning) return;

        const start = performance.now() - elapsedRef.current;
        const id = setInterval(() => {
            const next = performance.now() - start;
            setElapsedMs(Math.max(0, Math.floor(next)));
        }, 200);

        return () => clearInterval(id);
    }, [timerRunning]);

    useEffect(() => {
        if (!envelopeOpen) {
            if (autoOpenTimerRef.current) clearTimeout(autoOpenTimerRef.current);
            autoOpenTimerRef.current = null;
            setValentineOpen(false);
            localStorage.setItem("jex_read_open", "0");
            window.dispatchEvent(new Event("jex_read_close"));
            return;
        }

        localStorage.setItem("jex_read_open", "1");
        window.dispatchEvent(new Event("jex_read_open"));

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        if (autoOpenTimerRef.current) clearTimeout(autoOpenTimerRef.current);
        setValentineOpen(false);
        autoOpenTimerRef.current = setTimeout(() => {
            setValentineOpen(true);
            autoOpenTimerRef.current = null;
        }, 2000);

        return () => {
            document.body.style.overflow = prevOverflow;
            if (autoOpenTimerRef.current) clearTimeout(autoOpenTimerRef.current);
            autoOpenTimerRef.current = null;
            setValentineOpen(false);
            localStorage.setItem("jex_read_open", "0");
            window.dispatchEvent(new Event("jex_read_close"));
        };
    }, [envelopeOpen]);

    const resetGame = () => {
        if (matchTimerRef.current) clearTimeout(matchTimerRef.current);
        if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
        if (glowTimerRef.current) clearTimeout(glowTimerRef.current);
        if (burstTimerRef.current) clearTimeout(burstTimerRef.current);
        if (autoOpenTimerRef.current) clearTimeout(autoOpenTimerRef.current);
        autoOpenTimerRef.current = null;

        localStorage.removeItem("valentine_match_unlocked");
        window.dispatchEvent(new Event("valentine_match_locked"));

        localStorage.setItem("jex_read_open", "0");
        window.dispatchEvent(new Event("jex_read_close"));

        setDeck(buildDeck());
        setFirstPick(null);
        setSecondPick(null);
        setLock(false);
        setMoves(0);
        setScore(0);
        setJustMatchedKey(null);
        setEnvelopeOpen(false);
        setValentineOpen(false);

        setElapsedMs(0);
        setTimerRunning(false);
        setHeartBursts([]);
    };

    const kickMatchFX = () => {
        const sfx = sfxRef.current;
        if (sfx) {
            try {
                sfx.currentTime = 0;
                sfx.play();
            } catch {}
        }

        const el = boardRef.current;
        const rect = el?.getBoundingClientRect?.();
        const baseX = rect ? rect.width / 2 : 0;
        const baseY = rect ? rect.height / 2 : 0;

        const id = burstIdRef.current++;
        const count = 14;
        const parts = Array.from({ length: count }, (_, i) => {
            const ang = (Math.PI * 2 * i) / count + (Math.random() * 0.35 - 0.175);
            const dist = 70 + Math.random() * 80;
            const dx = Math.cos(ang) * dist;
            const dy = Math.sin(ang) * dist;
            const s = 0.75 + Math.random() * 0.75;
            const r = Math.floor(Math.random() * 40 - 20);
            const d = Math.floor(Math.random() * 80);
            return { key: `${id}-${i}`, x: baseX, y: baseY, dx, dy, s, r, d };
        });

        setHeartBursts((prev) => [...prev, { id, parts }]);
        if (burstTimerRef.current) clearTimeout(burstTimerRef.current);
        burstTimerRef.current = setTimeout(() => {
            setHeartBursts((prev) => prev.filter((b) => b.id !== id));
        }, 900);
    };

    const flipCard = (id) => {
        if (lockRef.current) return;

        const currentFirst = firstPickRef.current;
        const currentSecond = secondPickRef.current;

        if (currentFirst && currentSecond) return;
        if (currentFirst === id) return;

        const currentDeck = deckRef.current;
        const card = currentDeck.find((c) => c.id === id);
        if (!card || card.faceUp || card.matched) return;

        if (!timerRunningRef.current && elapsedRef.current === 0) setTimerRunning(true);

        setDeck((prev) => prev.map((c) => (c.id === id ? { ...c, faceUp: true } : c)));

        if (!currentFirst) {
            setFirstPick(id);
            return;
        }

        if (currentFirst && !currentSecond) {
            setSecondPick(id);
            setMoves((m) => m + 1);
        }
    };

    useEffect(() => {
        if (!firstPick || !secondPick) return;

        if (matchTimerRef.current) clearTimeout(matchTimerRef.current);
        if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
        if (glowTimerRef.current) clearTimeout(glowTimerRef.current);

        const currentDeck = deckRef.current;
        const a = currentDeck.find((c) => c.id === firstPick);
        const b = currentDeck.find((c) => c.id === secondPick);
        if (!a || !b) return;

        setLock(true);

        const isMatch = a.pairKey === b.pairKey;

        if (isMatch) {
            setDeck((prev) =>
                prev.map((c) => (c.id === a.id || c.id === b.id ? { ...c, matched: true, faceUp: true } : c))
            );
            setScore((s) => s + 1);
            setJustMatchedKey(a.pairKey);

            kickMatchFX();

            matchTimerRef.current = setTimeout(() => {
                setFirstPick(null);
                setSecondPick(null);
                setLock(false);
                glowTimerRef.current = setTimeout(() => setJustMatchedKey(null), 500);
            }, 420);
        } else {
            clearTimerRef.current = setTimeout(() => {
                setDeck((prev) => prev.map((c) => (c.id === a.id || c.id === b.id ? { ...c, faceUp: false } : c)));
                setFirstPick(null);
                setSecondPick(null);
                setLock(false);
            }, 680);
        }

        return () => {
            if (matchTimerRef.current) clearTimeout(matchTimerRef.current);
            if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
            if (glowTimerRef.current) clearTimeout(glowTimerRef.current);
        };
    }, [firstPick, secondPick]);

    useEffect(() => {
        if (score > best) setBest(score);
    }, [score, best]);

    useEffect(() => {
        if (!unlocked) return;

        const canvas = confettiRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

        const resize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        resize();
        window.addEventListener("resize", resize, { passive: true });

        const W = () => window.innerWidth;
        const H = () => window.innerHeight;

        const particles = Array.from({ length: 180 }, () => {
            const x = Math.random() * W();
            const y = -20 - Math.random() * 240;
            const s = 4 + Math.random() * 8;
            const vx = -1.25 + Math.random() * 2.5;
            const vy = 1.7 + Math.random() * 3.0;
            const r = Math.random() * Math.PI * 2;
            const vr = -0.12 + Math.random() * 0.24;
            const t = ["heart", "dot", "petal"][Math.floor(Math.random() * 3)];
            return { x, y, s, vx, vy, r, vr, t, life: 320 + Math.random() * 160 };
        });

        const drawHeart = (x, y, s, rot) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rot);
            ctx.beginPath();
            const k = s;
            ctx.moveTo(0, -k * 0.2);
            ctx.bezierCurveTo(k * 0.8, -k * 1.1, k * 1.9, -k * 0.1, 0, k * 1.3);
            ctx.bezierCurveTo(-k * 1.9, -k * 0.1, -k * 0.8, -k * 1.1, 0, -k * 0.2);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        };

        const loop = () => {
            const w = W();
            const h = H();

            ctx.clearRect(0, 0, w, h);

            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                p.r += p.vr;
                p.life -= 1;

                if (p.y > h + 40 || p.life <= 0) {
                    p.x = Math.random() * w;
                    p.y = -20 - Math.random() * 240;
                    p.vy = 1.7 + Math.random() * 3.0;
                    p.vx = -1.25 + Math.random() * 2.5;
                    p.r = Math.random() * Math.PI * 2;
                    p.vr = -0.12 + Math.random() * 0.24;
                    p.life = 320 + Math.random() * 160;
                    p.s = 4 + Math.random() * 8;
                    p.t = ["heart", "dot", "petal"][Math.floor(Math.random() * 3)];
                }

                const alpha = Math.max(0, Math.min(1, p.life / 260));
                ctx.fillStyle = `rgba(255, 77, 166, ${0.68 * alpha})`;

                if (p.t === "heart") drawHeart(p.x, p.y, p.s, p.r);
                else if (p.t === "petal") {
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.r);
                    ctx.beginPath();
                    ctx.ellipse(0, 0, p.s * 0.9, p.s * 0.55, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                } else {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.s * 0.45, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener("resize", resize);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [unlocked]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") setEnvelopeOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const audioRef = useRef(null);
    const [queue, setQueue] = useState(() => TRACKS);
    const [trackIndex, setTrackIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const playingRef = useRef(playing);
    const autoplayNextRef = useRef(false);

    useEffect(() => {
        playingRef.current = playing;
    }, [playing]);

    useEffect(() => {
        setQueue(TRACKS);
        setTrackIndex(0);
        setPlaying(false);
        autoplayNextRef.current = false;
    }, [TRACKS]);

    const track = queue[Math.max(0, Math.min(queue.length - 1, trackIndex))];

    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.9);
    const [seeking, setSeeking] = useState(false);

    const fmt = (t) => {
        const s = Math.max(0, Math.floor(t || 0));
        const m = Math.floor(s / 60);
        const r = s % 60;
        return `${m}:${String(r).padStart(2, "0")}`;
    };

    const fmtTimer = (ms) => {
        const total = Math.max(0, Math.floor((ms || 0) / 1000));
        const h = Math.floor(total / 3600);
        const m = Math.floor((total % 3600) / 60);
        const s = total % 60;
        if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
        return `${m}:${String(s).padStart(2, "0")}`;
    };

    const setAudioVolume = (v) => {
        const a = audioRef.current;
        if (a) a.volume = Math.max(0, Math.min(1, v));
    };

    const syncPlayState = async (nextPlaying) => {
        const a = audioRef.current;
        if (!a) {
            setPlaying(false);
            return;
        }
        if (nextPlaying) {
            try {
                await a.play();
                setPlaying(true);
            } catch {
                setPlaying(false);
            }
        } else {
            a.pause();
            setPlaying(false);
        }
    };

    const playNowAtIndex = async (idx) => {
        if (!queue.length) return;
        const nextIdx = Math.max(0, Math.min(queue.length - 1, idx));
        autoplayNextRef.current = true;
        setTrackIndex(nextIdx);
        const a = audioRef.current;
        if (a) {
            try {
                await a.play();
                setPlaying(true);
            } catch {
                setPlaying(false);
            }
        }
    };

    const seekTo = (t) => {
        const a = audioRef.current;
        if (!a) return;
        const clamped = Math.max(0, Math.min(a.duration || 0, t));
        a.currentTime = clamped;
        setCurrentTime(clamped);
    };

    const nextTrack = () => setTrackIndex((i) => (queue.length ? (i + 1) % queue.length : 0));
    const prevTrack = () => setTrackIndex((i) => (queue.length ? (i - 1 + queue.length) % queue.length : 0));

    useEffect(() => {
        const a = audioRef.current;
        if (!a) return;

        setAudioVolume(volume);

        const onLoaded = () => setDuration(Number.isFinite(a.duration) ? a.duration : 0);
        const onTime = () => {
            if (!seeking) setCurrentTime(a.currentTime || 0);
        };
        const onEnded = () => {
            if (!queue.length) {
                setPlaying(false);
                return;
            }
            autoplayNextRef.current = true;
            setTrackIndex((i) => (i + 1) % queue.length);
        };
        const onPlay = () => setPlaying(true);
        const onPause = () => setPlaying(false);

        a.addEventListener("loadedmetadata", onLoaded);
        a.addEventListener("timeupdate", onTime);
        a.addEventListener("ended", onEnded);
        a.addEventListener("play", onPlay);
        a.addEventListener("pause", onPause);

        return () => {
            a.removeEventListener("loadedmetadata", onLoaded);
            a.removeEventListener("timeupdate", onTime);
            a.removeEventListener("ended", onEnded);
            a.removeEventListener("play", onPlay);
            a.removeEventListener("pause", onPause);
        };
    }, [seeking, volume, queue.length]);

    useEffect(() => {
        const a = audioRef.current;
        if (!a) return;

        const shouldAuto = autoplayNextRef.current || playingRef.current;
        autoplayNextRef.current = false;

        setCurrentTime(0);
        setDuration(0);

        a.pause();
        a.src = track?.src || "";
        a.load();

        if (shouldAuto && track?.src) {
            (async () => {
                try {
                    await a.play();
                    setPlaying(true);
                } catch {
                    setPlaying(false);
                }
            })();
        } else {
            setPlaying(false);
        }
    }, [trackIndex, track?.src]);

    useEffect(() => {
        setAudioVolume(volume);
    }, [volume]);

    const labelAccent = "text-[var(--accent-text)]";
    const rangeAccent = "accent-[var(--accent-solid)]";
    const primaryBtn = "bg-[var(--accent-solid)] text-white";
    const softBtn = "border border-[var(--soft-border)] bg-white/70 text-slate-700";

    const canPortal = typeof document !== "undefined";

    const confettiLayer =
        unlocked && canPortal
            ? createPortal(
                  <div className="pointer-events-none fixed inset-0 z-[2147483646]">
                      <canvas ref={confettiRef} className="h-full w-full" />
                  </div>,
                  document.body
              )
            : null;

    const modalLayer =
        envelopeOpen && canPortal
            ? createPortal(
                  <div className="fixed inset-0 z-[2147483647]" role="dialog" aria-modal="true" onMouseDown={() => setEnvelopeOpen(false)}>
                      <div className="absolute inset-0 bg-black/35 backdrop-blur-md" />

                      <div className="relative mx-auto grid min-h-dvh place-items-center px-4 py-6">
                          <div className="relative w-full max-w-[1100px]" onMouseDown={(e) => e.stopPropagation()}>
                              <div className="relative mx-auto flex w-full items-center justify-center">
                                  <div
                                      className={[
                                          "relative flex items-center justify-center",
                                          "transition-transform duration-700 ease-out will-change-transform",
                                          valentineOpen ? "translate-x-0 lg:-translate-x-[220px]" : "translate-x-0",
                                      ].join(" ")}
                                  >
                                      <button
                                          type="button"
                                          onClick={() => {
                                              if (autoOpenTimerRef.current) clearTimeout(autoOpenTimerRef.current);
                                              autoOpenTimerRef.current = null;
                                              setValentineOpen(true);
                                          }}
                                          className={[
                                              "group relative grid place-items-center",
                                              "bg-transparent border-0 shadow-none",
                                              "transition-all duration-500 ease-out will-change-transform",
                                              "hover:-translate-y-0.5",
                                              "active:translate-y-0 active:scale-[0.99]",
                                              "focus:outline-none",
                                          ].join(" ")}
                                          aria-label="Open message"
                                      >
                                          <img
                                              src="/jex2.png"
                                              alt="Jex"
                                              className={[
                                                  "max-h-[72vh] w-auto select-none outline-none",
                                                  "transition-transform duration-500 ease-out will-change-transform",
                                              ].join(" ")}
                                              draggable="false"
                                          />
                                      </button>
                                  </div>

                                  <div
                                      className={[
                                          "absolute left-1/2 top-1/2 -translate-y-1/2",
                                          "w-[min(440px,92vw)]",
                                          "transition-all duration-700 ease-out will-change-transform",
                                          valentineOpen ? "opacity-100 translate-x-[100px] lg:translate-x-[20px]" : "opacity-0 translate-x-0 pointer-events-none",
                                      ].join(" ")}
                                      onMouseDown={(e) => e.stopPropagation()}
                                  >
                                      <div className="relative overflow-hidden rounded-[30px] border border-white/20 bg-white/90 shadow-[0_22px_80px_-60px_rgba(0,0,0,0.8)]">
                                          <div className="flex items-center justify-between gap-3 border-b border-black/5 bg-white/70 px-5 py-4">
                                              <div className="flex items-center gap-2">
                                                  <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-2xl border border-black/10 bg-white">
                                                      <img src={ENVELOPE_ICON} alt="Envelope" draggable="false" className="h-6 w-6 object-contain" />
                                                  </span>
                                                  <div className="min-w-0">
                                                      <div className="text-sm font-extrabold text-slate-900">Special Valentine's Message for ADOY</div>
                                                      <div className="text-[11px] font-semibold text-slate-500">For you, with love 💗</div>
                                                  </div>
                                              </div>

                                              <button
                                                  type="button"
                                                  onClick={() => setEnvelopeOpen(false)}
                                                  className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                                              >
                                                  Close
                                              </button>
                                          </div>

                                          <div className="px-5 pb-5 pt-4">
                                              <div className="rounded-[22px] border border-[var(--soft-border)] bg-white/80 p-4 sm:p-5">
                                                  <div className="text-sm sm:text-[15px] font-semibold leading-relaxed text-slate-700">
                                                      Hello Adoy, 🌹<br />
                                                      Happy Valentine's Day, Kamusta ikaw? I'm here ulet. I hope na hindi ka pa nakukulitan sa akin huhu,
                                                      Alam mo ba na hindi ko alam kung pano ko hihigitan yung previous na ginawa ko para sayo huhu, gusto ko
                                                      lang talaga na mapasaya ang isang Aila Medel kahit na sa simpleng bagay lang kaya ginagawa ko parin tong
                                                      mga to, and I hope nagugustuhan mo po, kaya sana hayaan mo lang ako ha, na i pa feel sayo yung deserved
                                                      mo, kahit walang kapalit gagawin ko parin naman to ng paulit-ulit hehe. Pero I just wanna say na super
                                                      thankful ako na nakilala kita, alam ko na ang weird kasi hindi naman kita nakikita tsaka nakakasama diba pero ang gaan ng loob ko sayo.
                                                      Tsaka alam mo ba isa ka sa naging inspirasyon ko habang nasa thesis arc
                                                      ako, kaya gusto ko rin talaga mag thankyou sayo adoyyy! Palagi kang kasama sa prayers ko at wish ko always
                                                      na maging masaya ka lang palagi, kayo ni baby Aqui. Hoping din ako na someday magkita ulet tayo and syempre
                                                      makita din si baby aqui hehe. So ayun lang, Sana nagustuhan mo to and sana napangiti kita kahit papano hehehe. Mahalaga ka, mahalaga ka palagi.
                                                      Ingat always Adoyyyyy! 💗<br />
                                                  </div>
                                                  <div className="mt-4 flex items-center justify-between">
                                                      <div className="text-[11px] font-bold text-slate-500">Sealed with love</div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              <div className="pointer-events-none absolute inset-0" />
                          </div>
                      </div>
                  </div>,
                  document.body
              )
            : null;

    const [dragId, setDragId] = useState(null);
    const [dragOverId, setDragOverId] = useState(null);

    const moveQueueItemById = (fromId, toId) => {
        if (!fromId || !toId || fromId === toId) return;
        setQueue((prev) => {
            const fromIdx = prev.findIndex((t) => t.id === fromId);
            const toIdx = prev.findIndex((t) => t.id === toId);
            if (fromIdx < 0 || toIdx < 0) return prev;

            const next = [...prev];
            const [item] = next.splice(fromIdx, 1);
            next.splice(toIdx, 0, item);

            setTrackIndex((cur) => {
                if (cur === fromIdx) return toIdx;
                if (fromIdx < toIdx && cur > fromIdx && cur <= toIdx) return cur - 1;
                if (fromIdx > toIdx && cur >= toIdx && cur < fromIdx) return cur + 1;
                return cur;
            });

            return next;
        });
    };

    const queueViewportRef = useRef(null);
    const [queueDragging, setQueueDragging] = useState(false);
    const queueDragRef = useRef({ active: false, startY: 0, startScrollTop: 0, pid: null });

    const onQueueWheel = (e) => {
        const el = queueViewportRef.current;
        if (!el) return;
        el.scrollTop += e.deltaY;
    };

    const onQueuePointerDown = (e) => {
        const el = queueViewportRef.current;
        if (!el) return;

        if (e.button !== 0) return;

        const target = e.target;
        const overItem = target?.closest?.("button[draggable='true']");
        if (overItem) return;

        try {
            el.setPointerCapture(e.pointerId);
        } catch {}

        queueDragRef.current = {
            active: true,
            startY: e.clientY,
            startScrollTop: el.scrollTop,
            pid: e.pointerId,
        };

        setQueueDragging(true);
    };

    const onQueuePointerMove = (e) => {
        const el = queueViewportRef.current;
        if (!el) return;

        const st = queueDragRef.current;
        if (!st.active) return;
        if (st.pid != null && e.pointerId !== st.pid) return;

        const dy = e.clientY - st.startY;
        el.scrollTop = st.startScrollTop - dy;
    };

    const endQueuePointer = (e) => {
        const el = queueViewportRef.current;
        const st = queueDragRef.current;
        if (!st.active) return;
        if (st.pid != null && e.pointerId !== st.pid) return;

        queueDragRef.current = { active: false, startY: 0, startScrollTop: 0, pid: null };
        setQueueDragging(false);

        try {
            el?.releasePointerCapture?.(e.pointerId);
        } catch {}
    };

    const labelAccent2 = "text-[var(--accent-text)]";
    const rangeAccent2 = "accent-[var(--accent-solid)]";
    const primaryBtn2 = "bg-[var(--accent-solid)] text-white";
    const softBtn2 = "border border-[var(--soft-border)] bg-white/70 text-slate-700";

    return (
        <>
            <style>{`
                @keyframes vHeartPop {
                    0% { transform: translate3d(0,0,0) scale(0.65) rotate(var(--r)); opacity: 0; filter: blur(0px); }
                    12% { opacity: 1; }
                    70% { opacity: 0.95; }
                    100% { transform: translate3d(var(--dx), var(--dy), 0) scale(var(--s)) rotate(var(--r)); opacity: 0; filter: blur(0.4px); }
                }
                .v-heart {
                    animation: vHeartPop 820ms cubic-bezier(.2,.85,.25,1) forwards;
                    animation-delay: var(--d);
                }
                .v-queue-scroll {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                .v-queue-scroll::-webkit-scrollbar {
                    width: 0px;
                    height: 0px;
                }
                .v-hero-scroll {
                    min-height: 100dvh;
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;
                    padding-bottom: env(safe-area-inset-bottom);
                }
            `}</style>

            <section className="relative isolate font-['Poppins'] -mb-px bg-[var(--bg-via)]">
                <div className="v-hero-scroll">
                    <div className="mx-auto w-full max-w-300 px-3 sm:px-6 lg:px-10 py-6 sm:py-10">
                        <div className="relative overflow-hidden rounded-[30px] sm:rounded-[34px] border border-[var(--soft-border)] bg-[var(--panel)] shadow-[0_18px_50px_-38px_var(--shadow)] backdrop-blur-xl">
                            <div className="pointer-events-none absolute inset-0 -z-10">
                                <div className="absolute inset-x-0 top-0 hidden h-px bg-white/80" />
                                <div className="absolute inset-x-0 bottom-0 h-px bg-[var(--line)]" />
                            </div>

                            <div className="relative grid gap-5 p-4 sm:p-7 lg:grid-cols-[1.15fr_0.85fr] lg:gap-7">
                                <div className="rounded-[26px] sm:rounded-[28px] border border-[var(--soft-border)] bg-[var(--pill)] p-4 sm:p-6 shadow-[0_12px_26px_-22px_var(--shadow)] backdrop-blur">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--soft-border)] bg-white/70 px-3 py-1 text-[11px] sm:text-xs font-semibold text-slate-700">
                                                <span className="grid h-5 w-5 place-items-center overflow-hidden">
                                                    <img src={BADGE_ICON} alt={isBlue ? "Blue badge" : "Red badge"} className="h-full w-full object-cover" draggable="false" />
                                                </span>
                                                Valentine’s Card Match
                                            </div>

                                            <div className="mt-4 text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Match the cute cards.</div>
                                            <div className="mt-1 text-[13px] sm:text-base font-semibold text-slate-600">
                                                Match all the pairs to unlock the Valentine message made especially for you. Enjoy ADOY! 💗
                                            </div>
                                        </div>

                                        <button
                                            onClick={resetGame}
                                            className={[
                                                "shrink-0 inline-flex items-center justify-center gap-2",
                                                "rounded-3xl border border-[var(--soft-border)] bg-white/70 px-3 sm:px-4 py-2",
                                                "text-[11px] sm:text-sm font-semibold text-slate-700",
                                                "shadow-[0_12px_26px_-22px_var(--shadow)]",
                                                "transition-all duration-200 ease-out",
                                                "hover:-translate-y-0.5 hover:bg-white",
                                                "active:translate-y-0",
                                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-white/70",
                                            ].join(" ")}
                                        >
                                            <span className="grid h-4 w-4 sm:h-5 sm:w-5 place-items-center overflow-hidden">
                                                <img src={NEW_GAME_ICON} alt="New game" className="h-full w-full object-cover" draggable="false" />
                                            </span>
                                            Restart Game
                                        </button>
                                    </div>

                                    <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-2 sm:gap-3">
                                        <div className="rounded-3xl border border-[var(--soft-border)] bg-white/70 px-3 sm:px-4 py-3 shadow-sm">
                                            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500">Timer</div>
                                            <div className="mt-1 text-lg sm:text-2xl font-extrabold text-slate-900">{fmtTimer(elapsedMs)}</div>
                                        </div>

                                        <div className="rounded-3xl border border-[var(--soft-border)] bg-white/70 px-3 sm:px-4 py-3 shadow-sm">
                                            <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500">Moves</div>
                                            <div className="mt-1 text-lg sm:text-2xl font-extrabold text-slate-900">{moves}</div>
                                        </div>
                                    </div>

                                    <div className="mt-4 sm:mt-5">
                                        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                                            <span>Reward progress</span>
                                            <span className="text-[var(--accent-text)]">{unlocked ? "Unlocked" : "Locked"}</span>
                                        </div>
                                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/70 ring-1 ring-[var(--soft-border)]">
                                            <div className="h-full rounded-full bg-[var(--accent-solid)] transition-[width] duration-500" style={{ width: `${allMatched ? 100 : 0}%` }} />
                                        </div>
                                    </div>

                                    <div className="mt-5 sm:mt-6 relative">
                                        <div className="relative" ref={boardRef}>
                                            <div className="pointer-events-none absolute inset-0 z-20">
                                                {heartBursts.map((b) => (
                                                    <div key={b.id} className="absolute inset-0">
                                                        {b.parts.map((p) => (
                                                            <div
                                                                key={p.key}
                                                                className="v-heart absolute"
                                                                style={{
                                                                    left: p.x,
                                                                    top: p.y,
                                                                    transform: "translate3d(0,0,0)",
                                                                    "--dx": `${p.dx}px`,
                                                                    "--dy": `${p.dy}px`,
                                                                    "--s": p.s,
                                                                    "--r": `${p.r}deg`,
                                                                    "--d": `${p.d}ms`,
                                                                }}
                                                            >
                                                                <div className="grid place-items-center">
                                                                    <svg width="18" height="18" viewBox="0 0 24 24" className="drop-shadow-sm">
                                                                        <path
                                                                            d="M12 21s-7.2-4.65-9.6-8.7C.45 9.3 2.1 6 5.7 6c2 0 3.3 1.2 4.3 2.4C11 7.2 12.3 6 14.3 6c3.6 0 5.25 3.3 3.3 6.3C19.2 16.35 12 21 12 21z"
                                                                            fill="rgba(255,77,166,0.95)"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-4 gap-2 sm:gap-3">
                                                {deck.map((card) => {
                                                    const isUp = card.faceUp || card.matched;
                                                    const glow = justMatchedKey && card.pairKey === justMatchedKey && card.matched;

                                                    return (
                                                        <button
                                                            key={card.id}
                                                            onClick={() => flipCard(card.id)}
                                                            disabled={lock || card.matched}
                                                            className={[
                                                                "group relative aspect-[3/4] overflow-hidden rounded-[18px] sm:rounded-[22px] border text-left",
                                                                "transition-all duration-200 ease-out active:scale-[0.99] select-none",
                                                                "shadow-[0_12px_26px_-22px_var(--shadow)]",
                                                                card.matched
                                                                    ? "border-[var(--soft-border)] bg-white/75"
                                                                    : "border-[var(--soft-border)] bg-white/60 hover:bg-white/80 hover:-translate-y-0.5",
                                                                glow ? "ring-2 ring-[var(--ring)]" : "",
                                                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-white/70",
                                                            ].join(" ")}
                                                        >
                                                            <div className="relative h-full w-full p-2.5 sm:p-3">
                                                                <div
                                                                    className={[
                                                                        "flex h-full w-full items-center justify-center rounded-[14px] sm:rounded-[18px]",
                                                                        "border border-[var(--soft-border)] bg-transparent",
                                                                        "transition-all duration-300",
                                                                        isUp ? "opacity-0 scale-[0.98]" : "opacity-100",
                                                                    ].join(" ")}
                                                                >
                                                                    <div className="grid place-items-center">
                                                                        <div className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center overflow-hidden rounded-2xl bg-transparent shadow-none">
                                                                            <img src={CARD_BACK_IMG} alt="Card back" className="h-full w-full object-contain" draggable="false" />
                                                                        </div>
                                                                        <div className="mt-2 text-[10px] sm:text-[11px] font-semibold tracking-wide text-slate-600">Tap</div>
                                                                    </div>
                                                                </div>

                                                                <div
                                                                    className={[
                                                                        "absolute inset-2.5 sm:inset-3 grid place-items-center rounded-[14px] sm:rounded-[18px]",
                                                                        "border border-[var(--soft-border)] bg-white/80",
                                                                        "transition-all duration-300",
                                                                        isUp ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]",
                                                                    ].join(" ")}
                                                                >
                                                                    <div className="grid place-items-center gap-2">
                                                                        <div className="grid h-12 w-12 sm:h-16 sm:w-16 place-items-center rounded-2xl bg-white/80 border border-[var(--soft-border)] shadow-sm overflow-hidden">
                                                                            <img src={card.img} alt={card.label} className="h-9 w-9 sm:h-11 sm:w-11 object-contain drop-shadow" draggable={false} />
                                                                        </div>
                                                                        <div className="text-[10px] sm:text-xs font-semibold text-slate-700">{card.label}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div className="text-[13px] sm:text-sm font-semibold text-slate-700">
                                            {allMatched ? (
                                                <span className="text-[var(--accent-text)]">All matched! Congratulations, you unlocked the special valentine message.</span>
                                            ) : (
                                                <span>Match all pairs to unlock the special valentine message.</span>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => unlocked && setEnvelopeOpen(true)}
                                            disabled={!unlocked}
                                            className={[
                                                "relative inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-3xl px-5 py-3",
                                                "text-sm font-semibold transition-all duration-200 ease-out",
                                                "shadow-[0_12px_26px_-22px_var(--shadow)]",
                                                "active:scale-[0.99]",
                                                unlocked
                                                    ? "bg-[var(--accent-solid)] text-white hover:-translate-y-0.5 hover:brightness-95"
                                                    : "border border-[var(--soft-border)] bg-white/60 text-slate-400 cursor-not-allowed",
                                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-white/70",
                                            ].join(" ")}
                                        >
                                            <span className="grid h-5 w-5 place-items-center overflow-hidden">
                                                <img src={ENVELOPE_ICON} alt="Envelope" draggable="false" className="h-full w-full object-contain bg-transparent mix-blend-multiply" />
                                            </span>
                                            <span>{unlocked ? "Read" : "Locked"}</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="rounded-[26px] sm:rounded-[28px] border border-[var(--soft-border)] bg-[var(--pill)] p-4 sm:p-6 shadow-[0_12px_26px_-22px_var(--shadow)] backdrop-blur">
                                    <div className="mb-3 sm:mb-4">
                                        <div className={["text-lg sm:text-xl font-extrabold", labelAccent2].join(" ")}>Music Player</div>
                                        <div className="mt-0.5 text-xs sm:text-sm font-semibold text-slate-600">Pick a song from the queue and enjoy the vibe.</div>
                                    </div>

                                    <div className="relative overflow-hidden rounded-[26px] sm:rounded-[28px] border border-[var(--soft-border)] bg-white/70 shadow-[0_12px_26px_-22px_var(--shadow)]">
                                        <div className="relative p-4 sm:p-5">
                                            <audio ref={audioRef} preload="metadata" />

                                            <div className="relative overflow-hidden rounded-[18px] sm:rounded-[20px] bg-black/90 aspect-square border border-white/10 shadow-sm">
                                                <img src={track?.cover || BADGE_ICON} alt="Cover" className="absolute inset-0 h-full w-full object-cover" draggable="false" />
                                                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/60" />
                                            </div>

                                            <div className="mt-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <div className="truncate text-base sm:text-lg font-extrabold text-slate-900">{track?.title}</div>
                                                        <div className="truncate text-xs sm:text-sm font-semibold text-slate-600">{track?.artist}</div>
                                                    </div>
                                                </div>

                                                <div className="mt-3">
                                                    <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-slate-600">
                                                        <span className="text-[var(--accent-text)]">{fmt(currentTime)}</span>
                                                        <span className="text-[var(--accent-text)]">{fmt(duration)}</span>
                                                    </div>

                                                    <input
                                                        type="range"
                                                        min={0}
                                                        max={Math.max(0, Math.floor(duration || 0))}
                                                        value={Math.floor(currentTime)}
                                                        onMouseDown={() => setSeeking(true)}
                                                        onTouchStart={() => setSeeking(true)}
                                                        onMouseUp={() => setSeeking(false)}
                                                        onTouchEnd={() => setSeeking(false)}
                                                        onChange={(e) => {
                                                            const v = Number(e.target.value || 0);
                                                            setCurrentTime(v);
                                                            seekTo(v);
                                                        }}
                                                        className={["mt-1 w-full", rangeAccent2].join(" ")}
                                                    />
                                                </div>

                                                <div className="mt-4 flex items-center justify-between gap-3">
                                                    <button
                                                        onClick={prevTrack}
                                                        className={[
                                                            "grid h-10 w-10 place-items-center rounded-2xl",
                                                            softBtn2,
                                                            "shadow-sm transition-all duration-200",
                                                            "hover:-translate-y-0.5 hover:bg-white active:translate-y-0",
                                                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-white/70",
                                                        ].join(" ")}
                                                        aria-label="Previous"
                                                    >
                                                        <span className="grid h-5 w-5 place-items-center overflow-hidden">
                                                            <img src={PREV_ICON} alt="Previous" className="h-full w-full object-contain" draggable="false" />
                                                        </span>
                                                    </button>

                                                    <button
                                                        onClick={() => syncPlayState(!playing)}
                                                        className={[
                                                            "grid h-12 w-12 place-items-center rounded-full",
                                                            primaryBtn2,
                                                            "shadow-[0_18px_60px_-40px_var(--shadow)]",
                                                            "transition-all duration-200 ease-out",
                                                            "hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:scale-[0.99]",
                                                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-white/70",
                                                        ].join(" ")}
                                                        aria-label={playing ? "Pause" : "Play"}
                                                    >
                                                        <span className="text-base">{playing ? "⏸" : "▶"}</span>
                                                    </button>

                                                    <button
                                                        onClick={nextTrack}
                                                        className={[
                                                            "grid h-10 w-10 place-items-center rounded-2xl",
                                                            softBtn2,
                                                            "shadow-sm transition-all duration-200",
                                                            "hover:-translate-y-0.5 hover:bg-white active:translate-y-0",
                                                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-white/70",
                                                        ].join(" ")}
                                                        aria-label="Next"
                                                    >
                                                        <span className="grid h-5 w-5 place-items-center overflow-hidden">
                                                            <img src={NEXT_ICON} alt="Next" className="h-full w-full object-contain" draggable="false" />
                                                        </span>
                                                    </button>
                                                </div>

                                                <div className="mt-4 flex items-center justify-start gap-3">
                                                    <span className="grid h-5 w-5 place-items-center overflow-hidden">
                                                        <img src={VOLUME_ICON} alt="Volume" className="h-full w-full object-contain" draggable="false" />
                                                    </span>

                                                    <input
                                                        type="range"
                                                        min={0}
                                                        max={100}
                                                        value={Math.round(volume * 100)}
                                                        onChange={(e) => setVolume(Math.max(0, Math.min(1, Number(e.target.value) / 100)))}
                                                        className={["flex-1", rangeAccent2].join(" ")}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 rounded-3xl border border-[var(--soft-border)] bg-white/70 p-3 sm:p-4 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <div className={["text-xs font-semibold", labelAccent2].join(" ")}>Queue</div>
                                            <div className="text-xs font-semibold text-slate-600">
                                                <span className="text-[var(--accent-text)]">{Math.min(queue.length, trackIndex + 1)}</span>/{queue.length}
                                            </div>
                                        </div>

                                        <div
                                            ref={queueViewportRef}
                                            onWheel={onQueueWheel}
                                            onPointerDown={onQueuePointerDown}
                                            onPointerMove={onQueuePointerMove}
                                            onPointerUp={endQueuePointer}
                                            onPointerCancel={endQueuePointer}
                                            className={[
                                                "v-queue-scroll mt-3 grid gap-2 overflow-y-auto overscroll-contain pr-2",
                                                "select-none",
                                                queueDragging ? "cursor-grabbing" : "cursor-grab",
                                            ].join(" ")}
                                            style={{
                                                maxHeight: "min(520px, 42vh)",
                                                touchAction: "none",
                                            }}
                                        >
                                            {queue.map((t, idx) => {
                                                const active = idx === trackIndex;
                                                const isOver = dragOverId === t.id && dragId && dragId !== t.id;

                                                return (
                                                    <button
                                                        key={t.id}
                                                        type="button"
                                                        draggable
                                                        onDragStart={(e) => {
                                                            setDragId(t.id);
                                                            setDragOverId(t.id);
                                                            try {
                                                                e.dataTransfer.effectAllowed = "move";
                                                                e.dataTransfer.setData("text/plain", t.id);
                                                            } catch {}
                                                        }}
                                                        onDragOver={(e) => {
                                                            e.preventDefault();
                                                            setDragOverId(t.id);
                                                            try {
                                                                e.dataTransfer.dropEffect = "move";
                                                            } catch {}
                                                        }}
                                                        onDrop={(e) => {
                                                            e.preventDefault();
                                                            const from = (() => {
                                                                try {
                                                                    return e.dataTransfer.getData("text/plain") || dragId;
                                                                } catch {
                                                                    return dragId;
                                                                }
                                                            })();
                                                            moveQueueItemById(from, t.id);
                                                            setDragId(null);
                                                            setDragOverId(null);
                                                        }}
                                                        onDragEnd={() => {
                                                            setDragId(null);
                                                            setDragOverId(null);
                                                        }}
                                                        onClick={() => playNowAtIndex(idx)}
                                                        className={[
                                                            "flex w-full items-center gap-3 rounded-3xl border px-3 py-2 text-left",
                                                            "transition-all duration-200 ease-out",
                                                            active
                                                                ? "border-[var(--soft-border)] bg-white/85 shadow-sm"
                                                                : "border-[var(--soft-border)] bg-white/60 hover:bg-white/80 hover:-translate-y-0.5",
                                                            isOver ? "ring-2 ring-[var(--ring)]" : "",
                                                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-white/70",
                                                            "cursor-pointer",
                                                        ].join(" ")}
                                                    >
                                                        <div className="relative h-10 w-10 overflow-hidden rounded-2xl border border-[var(--soft-border)] bg-white/80">
                                                            <img src={t.cover || BADGE_ICON} alt={t.title} className="h-full w-full object-cover" draggable="false" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="truncate text-sm font-extrabold text-slate-900">{t.title}</div>
                                                            <div className="truncate text-xs font-semibold text-slate-600">{t.artist}</div>
                                                        </div>
                                                        <div
                                                            className={[
                                                                "shrink-0 rounded-2xl px-3 py-1 text-[11px] font-semibold",
                                                                active ? "bg-[var(--accent-solid)] text-white" : "border border-[var(--soft-border)] bg-white/70 text-slate-700",
                                                            ].join(" ")}
                                                        >
                                                            {active ? "Playing" : "Play"}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {confettiLayer}
            {modalLayer}
        </>
    );
}
