import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type RuntimeEnv = Record<string, unknown>;

type ServerRequestContext = {
  cloudflareEnv: RuntimeEnv;
};

declare module "@tanstack/react-router" {
  interface Register {
    server: {
      requestContext: ServerRequestContext;
    };
  }
}

type ServerEntry = {
  fetch: (
    request: Request,
    opts?: { context?: ServerRequestContext },
  ) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function verifyLineSignature(body: string, signature: string, channelSecret: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(channelSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return timingSafeEqual(bytesToBase64(new Uint8Array(digest)), signature);
}

async function handleLineWebhook(request: Request, env: RuntimeEnv): Promise<Response> {
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const channelSecret = String(env["LINE_CHANNEL_SECRET"] ?? "").trim();
  const token = String(env["LINE_CHANNEL_ACCESS_TOKEN"] ?? "").trim();
  const signature = request.headers.get("x-line-signature") ?? "";

  if (!channelSecret || !token) {
    return new Response("LINE secrets are not configured", { status: 500 });
  }

  const body = await request.text();
  if (!signature || !(await verifyLineSignature(body, signature, channelSecret))) {
    return new Response("Invalid signature", { status: 401 });
  }

  let payload: {
    events?: Array<{ type?: string; source?: { userId?: string }; message?: { type?: string } }>;
  };
  try {
    payload = JSON.parse(body);
  } catch {
    return new Response("Bad Request", { status: 400 });
  }

  const userIds = [...new Set(
    (payload.events ?? [])
      .filter((event) => event.type === "message")
      .map((event) => event.source?.userId)
      .filter((userId): userId is string => Boolean(userId)),
  )];

  if (userIds.length === 0) return new Response("OK");

  const response = await fetch("https://api.line.me/v2/bot/message/multicast", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: userIds,
      messages: [{
        type: "text",
        text: "🔔【行銷數據後台】\nLINE 通知測試成功！\n你的 LINE 串接已經可以正常發送訊息 🎉",
      }],
    }),
  });

  if (!response.ok) {
    console.error(`[LINE webhook] push failed: ${response.status}`);
    return new Response("LINE push failed", { status: 502 });
  }

  return new Response("OK");
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: RuntimeEnv, _ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/api/line/webhook") {
        return await handleLineWebhook(request, env);
      }

      const handler = await getServerEntry();
      // Cloudflare Worker bindings live in the per-request env object. Pass them
      // through TanStack Start's request context so server functions can read
      // them at runtime instead of relying on process.env.
      const response = await handler.fetch(request, {
        context: { cloudflareEnv: env },
      });
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
