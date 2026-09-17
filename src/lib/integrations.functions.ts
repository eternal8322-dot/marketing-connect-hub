import { createServerFn } from "@tanstack/react-start";

/**
 * Reads server-side secrets only. Never returns the values themselves —
 * only whether each secret is configured.
 */
export const getIntegrationStatus = createServerFn({ method: "GET" }).handler(async () => {
  const has = (name: string) => Boolean(process.env[name]?.trim());

  const line = {
    LINE_CHANNEL_ID: has("LINE_CHANNEL_ID"),
    LINE_CHANNEL_SECRET: has("LINE_CHANNEL_SECRET"),
    LINE_CHANNEL_ACCESS_TOKEN: has("LINE_CHANNEL_ACCESS_TOKEN"),
  };

  const meta = {
    META_ACCESS_TOKEN: has("META_ACCESS_TOKEN"),
    META_AD_ACCOUNT_ID: has("META_AD_ACCOUNT_ID"),
  };

  const google = {
    GOOGLE_ADS_DEVELOPER_TOKEN: has("GOOGLE_ADS_DEVELOPER_TOKEN"),
    GOOGLE_ADS_CUSTOMER_ID: has("GOOGLE_ADS_CUSTOMER_ID"),
    GOOGLE_ADS_REFRESH_TOKEN: has("GOOGLE_ADS_REFRESH_TOKEN"),
  };

  const allSet = (o: Record<string, boolean>) => Object.values(o).every(Boolean);

  return {
    line: { secrets: line, connected: allSet(line) },
    meta: { secrets: meta, connected: allSet(meta) },
    google: { secrets: google, connected: allSet(google) },
  };
});

/** Verifies the stored LINE credentials by calling LINE's bot info endpoint. */
export const verifyLineConnection = createServerFn({ method: "POST" }).handler(async () => {
  const token = process.env["LINE_CHANNEL_ACCESS_TOKEN"]?.trim();
  if (!token) {
    return { ok: false as const, message: "後端尚未設定 LINE_CHANNEL_ACCESS_TOKEN" };
  }

  try {
    const res = await fetch("https://api.line.me/v2/bot/info", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      return { ok: false as const, message: `LINE 回應 ${res.status}：憑證可能無效或已過期` };
    }
    const info = (await res.json()) as { displayName?: string; basicId?: string };
    return {
      ok: true as const,
      message: `已連線至官方帳號：${info.displayName ?? "(未命名)"} ${info.basicId ?? ""}`.trim(),
    };
  } catch {
    return { ok: false as const, message: "無法連線到 LINE API，請稍後再試" };
  }
});
