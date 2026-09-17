import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-line-signature",
};

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

async function verifySignature(body: string, signature: string, secret: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(body),
  );
  return timingSafeEqual(bytesToBase64(new Uint8Array(digest)), signature);
}

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  const channelSecret = Deno.env.get("LINE_CHANNEL_SECRET")?.trim() ?? "";
  const accessToken = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN")?.trim() ?? "";
  const signature = request.headers.get("x-line-signature") ?? "";

  if (!channelSecret || !accessToken) {
    console.error("[LINE webhook] secrets are not configured");
    return new Response("LINE secrets are not configured", { status: 500, headers: corsHeaders });
  }

  const body = await request.text();

  if (!signature || !(await verifySignature(body, signature, channelSecret))) {
    console.error("[LINE webhook] invalid signature");
    return new Response("Invalid signature", { status: 401, headers: corsHeaders });
  }

  let payload: {
    events?: Array<{
      type?: string;
      replyToken?: string;
      message?: { type?: string; text?: string };
    }>;
  };

  try {
    payload = JSON.parse(body);
  } catch {
    return new Response("Bad Request", { status: 400, headers: corsHeaders });
  }

  const events = payload.events ?? [];
  console.log(`[LINE webhook] received ${events.length} event(s)`);

  for (const event of events) {
    if (event.type !== "message" || event.message?.type !== "text" || !event.replyToken) {
      continue;
    }

    const response = await fetch("https://api.line.me/v2/bot/message/reply", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        replyToken: event.replyToken,
        messages: [
          {
            type: "text",
            text: "🔔【行銷數據後台】\nLINE Webhook 收到你的訊息了！\n串接測試成功 🎉",
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[LINE webhook] reply failed: ${response.status} ${errorBody}`);
      return new Response("LINE reply failed", { status: 502, headers: corsHeaders });
    }

    console.log("[LINE webhook] reply sent successfully");
  }

  return new Response("OK", { status: 200, headers: corsHeaders });
});
