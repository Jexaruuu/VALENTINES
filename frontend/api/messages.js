import crypto from "node:crypto";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const KEY = "jex_wall_messages";
const LIMIT = 120;

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const items = await redis.lrange(KEY, 0, LIMIT - 1);
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
      if (!cleanText) return res.status(400).json({ error: "Message required" });

      const cleanName = String(name || "").trim().slice(0, 40);
      const msg = {
        id: crypto.randomUUID(),
        name: cleanName,
        text: cleanText.slice(0, 600),
        ts: Date.now(),
      };

      await redis.lpush(KEY, JSON.stringify(msg));
      await redis.ltrim(KEY, 0, LIMIT - 1);

      res.status(200).json({ ok: true, message: msg });
      return;
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    console.error("API /messages error:", e);
    res.status(500).json({ error: "Server error" });
  }
}
