// api/messages.js
import crypto from "node:crypto";
import { kv } from "@vercel/kv";

const KEY = "jex_wall_messages";
const LIMIT = 120;

export default async function handler(req, res) {
    try {
        if (req.method === "GET") {
            const items = await kv.lrange(KEY, 0, LIMIT - 1);
            const messages = (items || [])
                .map((x) => {
                    try {
                        return typeof x === "string" ? JSON.parse(x) : x;
                    } catch {
                        return null;
                    }
                })
                .filter(Boolean);

            res.status(200).json({ messages });
            return;
        }

        if (req.method === "POST") {
            const { name, text } = req.body || {};
            const cleanText = String(text || "").trim();
            if (!cleanText) {
                res.status(400).json({ error: "Message required" });
                return;
            }

            const cleanName = String(name || "").trim().slice(0, 40);
            const msg = {
                id: crypto.randomUUID(),
                name: cleanName,
                text: cleanText.slice(0, 600),
                ts: Date.now(),
            };

            await kv.lpush(KEY, JSON.stringify(msg));
            await kv.ltrim(KEY, 0, LIMIT - 1);

            res.status(200).json({ ok: true, message: msg });
            return;
        }

        res.status(405).json({ error: "Method not allowed" });
    } catch (e) {
        console.error("API /messages error:", e);
        res.status(500).json({ error: "Server error" });
    }
}
