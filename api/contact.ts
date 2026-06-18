import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sendContactEmails } from "../server/contact.js";

/**
 * Vercel serverless wrapper around the shared contact logic in server/contact.js.
 * The same logic runs in the Docker/Express server (server/index.js).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body: unknown = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const { status, body: out } = await sendContactEmails(body);
  return res.status(status).json(out);
}
