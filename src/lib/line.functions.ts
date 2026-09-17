import { createServerFn } from "@tanstack/react-start";
import { getRequestContext } from "@tanstack/react-start/server";

function getEnv() {
  return getRequestContext().cloudflareEnv as Record<string, unknown>;
}

export const sendLineTestMessage = createServerFn({ method: "POST" }).handler(async () => {
  const env = getEnv();
  const token = String(env["LINE_CHANNEL_ACCESS_TOKEN"] ?? "").trim();
  const userId = String(env["LINE_TEST_USER_ID"] ?? "").trim();

  if (!token) throw new Error("尚未設定 LINE_CHANNEL_ACCESS_TOKEN");
  if (!userId) throw new Error("尚未設定 LINE_TEST_USER_ID。請先完成 LINE Webhook 綁定。");

  const response = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: userId,
      messages: [{ type: "text", text: "🔔【行銷數據後台】\nLINE 通知測試成功！\n你的 LINE 串接已經可以正常發送訊息 🎉" }],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`LINE 發送失敗 (${response.status})${detail ? `：${detail}` : ""}`);
  }

  return { success: true };
});
