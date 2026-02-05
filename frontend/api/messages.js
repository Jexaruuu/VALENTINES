import crypto from "node:crypto";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const KEY = "jex_wall_messages";
const LIMIT = 120;

const isAdmin = (req) => {
  const key = req.headers["x-admin-key"];
  return key && process.env.WALL_ADMIN_KEY && key === process.env.WALL_ADMIN_KEY;
};

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

    if (req.method === "DELETE") {
      if (!isAdmin(req)) return res.status(401).json({ error: "Unauthorized" });

      const { id } = req.query || {};
      if (!id) return res.status(400).json({ error: "id required" });

      const items = await redis.lrange(KEY, 0, LIMIT - 1);
      const idx = (items || []).findIndex((x) => {
        try {
          const m = typeof x === "string" ? JSON.parse(x) : x;
          return m?.id === id;
        } catch {
          return false;
        }
      });

      if (idx === -1) return res.status(404).json({ error: "Not found" });

      const target = items[idx];
      await redis.lset(KEY, idx, "__DELETED__");
      await redis.lrem(KEY, 1, "__DELETED__");

      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    console.error("API /messages error:", e);
    res.status(500).json({ error: "Server error" });
  }
}
