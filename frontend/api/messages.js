import crypto from "node:crypto";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const KEY = "jex_wall_messages";
const LIMIT = 120;

const isAdmin = (req) => {
  const key = req.headers["x-admin-key"];
  return key && process.env.WALL_ADMIN_KEY && key === process.env.WALL_ADMIN_KEY;
};

const ownerHashFromToken = (token) => {
  const t = String(token || "").trim();
  if (!t) return "";
  const pepper = process.env.WALL_OWNER_PEPPER || process.env.WALL_ADMIN_KEY || "";
  return crypto.createHash("sha256").update(`${pepper}:${t}`).digest("hex");
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const items = await redis.lrange(KEY, 0, LIMIT - 1);
      const requesterOwner = ownerHashFromToken(req.headers["x-owner-token"]);
      const admin = isAdmin(req);

      const messages = (items || [])
        .map((x) => {
          try {
            const m = typeof x === "string" ? JSON.parse(x) : x;
            if (!m) return null;
            return {
              id: m.id,
              name: m.name || "",
              text: m.text || "",
              image: m.image || "",
              audio: m.audio || "",
              ts: m.ts || 0,
              canDeleteOwn: admin || (!!requesterOwner && !!m.owner && m.owner === requesterOwner),
            };
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      res.status(200).json({ messages });
      return;
    }

    if (req.method === "POST") {
      const contentType = req.headers["content-type"] || "";
      let name = "";
      let text = "";
      let ownerToken = "";
      let imageData = "";
      let audioData = "";

      if (contentType.includes("multipart/form-data")) {
        const { Readable } = await import("stream");
        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        
        const boundary = contentType.split("boundary=")[1];
        if (!boundary) {
          return res.status(400).json({ error: "Invalid form data" });
        }

        const parts = buffer.toString("binary").split(`--${boundary}`);
        for (const part of parts) {
          if (part.includes("Content-Disposition: form-data; name=\"name\"")) {
            const match = part.match(/\r\n\r\n([\s\S]*?)\r\n--/);
            if (match) name = match[1].trim();
          } else if (part.includes("Content-Disposition: form-data; name=\"text\"")) {
            const match = part.match(/\r\n\r\n([\s\S]*?)\r\n--/);
            if (match) text = match[1].trim();
          } else if (part.includes("Content-Disposition: form-data; name=\"ownerToken\"")) {
            const match = part.match(/\r\n\r\n([\s\S]*?)\r\n--/);
            if (match) ownerToken = match[1].trim();
          } else if (part.includes("Content-Disposition: form-data; name=\"image\"")) {
            const match = part.match(/\r\n\r\n([\s\S]*?)\r\n--/);
            if (match) {
              const base64 = Buffer.from(match[1], "binary").toString("base64");
              const contentTypeMatch = part.match(/Content-Type: (.*?)\r\n/);
              const mimeType = contentTypeMatch ? contentTypeMatch[1] : "image/png";
              imageData = `data:${mimeType};base64,${base64}`;
            }
          } else if (part.includes("Content-Disposition: form-data; name=\"audio\"")) {
            const match = part.match(/\r\n\r\n([\s\S]*?)\r\n--/);
            if (match) {
              const base64 = Buffer.from(match[1], "binary").toString("base64");
              const contentTypeMatch = part.match(/Content-Type: (.*?)\r\n/);
              const mimeType = contentTypeMatch ? contentTypeMatch[1] : "audio/webm";
              audioData = `data:${mimeType};base64,${base64}`;
            }
          }
        }
      } else {
        return res.status(400).json({ error: "Expected multipart/form-data" });
      }

      const cleanText = String(text || "").trim();
      if (!cleanText && !imageData && !audioData) {
        return res.status(400).json({ error: "Message, image, or audio required" });
      }

      const cleanName = String(name || "").trim().slice(0, 40);
      const owner = ownerHashFromToken(ownerToken);

      const msg = {
        id: crypto.randomUUID(),
        name: cleanName,
        text: cleanText.slice(0, 600),
        image: imageData.slice(0, 500000),
        audio: audioData.slice(0, 500000),
        ts: Date.now(),
        owner: owner || "",
      };

      await redis.lpush(KEY, JSON.stringify(msg));
      await redis.ltrim(KEY, 0, LIMIT - 1);

      res.status(200).json({
        ok: true,
        message: {
          id: msg.id,
          name: msg.name,
          text: msg.text,
          image: msg.image,
          audio: msg.audio,
          ts: msg.ts,
          canDeleteOwn: true,
        },
      });
      return;
    }

    if (req.method === "DELETE") {
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

      const raw = items[idx];
      const target = typeof raw === "string" ? JSON.parse(raw) : raw;

      if (!isAdmin(req)) {
        const ownerToken = req.headers["x-owner-token"];
        const owner = ownerHashFromToken(ownerToken);

        if (!owner) return res.status(401).json({ error: "Unauthorized" });
        if (!target?.owner || target.owner !== owner) return res.status(403).json({ error: "Forbidden" });
      }

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