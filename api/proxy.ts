import type { Request, Response } from "express";

const ALLOWED_HOSTS = new Set([
  "script.google.com",
  "script.googleusercontent.com"
]);

function validateTargetUrl(value: unknown): URL {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("Missing Target Web App URL");
  }

  const target = new URL(value);
  if (target.protocol !== "https:" || !ALLOWED_HOSTS.has(target.hostname)) {
    throw new Error("Target URL harus berupa Google Apps Script Web App HTTPS.");
  }
  return target;
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, error: "Method Not Allowed" });
    return;
  }

  try {
    const target = validateTargetUrl(req.body?.url);
    const action = req.body?.action;
    const payload = req.body?.payload;

    if (action !== "get" && action !== "post") {
      res.status(400).json({ success: false, error: "Invalid action. Use 'get' or 'post'." });
      return;
    }

    const response = await fetch(target, {
      method: action === "get" ? "GET" : "POST",
      headers: action === "get" ? { Accept: "application/json" } : { "Content-Type": "text/plain" },
      body: action === "post" ? JSON.stringify(payload ?? {}) : undefined,
      redirect: "follow"
    });

    const text = await response.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Respon Google Apps Script bukan JSON valid.");
    }

    if (!response.ok) {
      res.status(502).json({ success: false, error: "Google Apps Script mengembalikan HTTP " + response.status });
      return;
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(502).json({
      success: false,
      error: error instanceof Error ? error.message : "Gagal menghubungi Google Apps Script."
    });
  }
}
