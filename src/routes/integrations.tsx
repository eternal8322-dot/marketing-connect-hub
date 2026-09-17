import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronRight, Copy, ExternalLink, KeyRound, MessageCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { integrations } from "@/lib/mock-data";

export const Route = createFileRoute("/integrations")({
  head: () => ({
    meta: [
      { title: "串接設定 | 行銷數據後台" },
      { name: "description", content: "逐步串接 Meta 廣告、Google 廣告與 LINE 通知，把示範資料換成真實數據。" },
      { property: "og:title", content: "串接設定 | 行銷數據後台" },
      { property: "og:description", content: "逐步串接 Meta 廣告、Google 廣告與 LINE 通知，把示範資料換成真實數據。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Integrations,
});

function Integrations() {
  const [lineOpen, setLineOpen] = useState(false);
  const [channelId, setChannelId] = useState("");
  const [channelSecret, setChannelSecret] = useState("");

  const line = integrations.find((i) => i.id === "line");

  return (
    <AdminShell title="串接設定" subtitle="先把 LINE 接起來，再讓通知規則真正開始工作。">
      <div className="mb-5 flex items-center gap-2 rounded-lg border-2 border-foreground bg-primary px-4 py-3 text-sm font-semibold shadow-[4px_4px_0_var(--foreground)]">
        <MessageCircle className="size-5" />
        <span>第一階段：LINE Messaging API</span>
        <Badge className="ml-auto border-2 border-foreground bg-background text-foreground">SETUP</Badge>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {integrations.map((i) => {
          const isLine = i.id === "line";
          return (
            <Card key={i.id} className={isLine ? "border-4 shadow-[6px_6px_0_var(--foreground)] lg:col-span-2" : "flex flex-col"}>
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div className="flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center border-2 border-foreground bg-primary">
                    {isLine ? <MessageCircle className="size-6" /> : <KeyRound className="size-5" />}
                  </div>
                  <div>
                    <CardTitle className="text-base">{i.name}</CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">{i.description}</p>
                  </div>
                </div>
                <Badge variant="outline" className="shrink-0 border-2">尚未串接</Badge>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                {isLine ? (
                  <>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {i.steps.map((s, idx) => (
                        <div key={idx} className="border-2 border-foreground bg-background p-3">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="flex size-7 items-center justify-center bg-foreground text-sm font-black text-primary">0{idx + 1}</span>
                            {idx === 0 && <Check className="size-4" />}
                          </div>
                          <p className="text-sm font-semibold leading-5">{s}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-start gap-3 border-2 border-dashed border-foreground p-4">
                      <ShieldCheck className="mt-0.5 size-5 shrink-0" />
                      <div className="text-xs leading-5 text-muted-foreground">
                        <p className="font-bold text-foreground">安全提醒</p>
                        <p>Channel secret 與 access token 不要直接寫進前端程式碼或 GitHub。正式串接時會放在後端／Supabase Secrets，由伺服器代為呼叫 LINE API。</p>
                      </div>
                    </div>

                    {lineOpen && (
                      <div className="mt-4 border-2 border-foreground bg-primary/30 p-4">
                        <div className="mb-4 flex items-center gap-2">
                          <span className="flex size-7 items-center justify-center bg-foreground text-sm font-black text-primary">01</span>
                          <div>
                            <p className="font-bold">建立 LINE Developers Channel</p>
                            <p className="text-xs text-muted-foreground">先取得 Channel ID / Secret，下一階段再加入 access token。</p>
                          </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="space-y-1.5 text-xs font-semibold">
                            Channel ID
                            <Input value={channelId} onChange={(e) => setChannelId(e.target.value)} placeholder="例如：1234567890" className="border-2 border-foreground bg-background" />
                          </label>
                          <label className="space-y-1.5 text-xs font-semibold">
                            Channel Secret
                            <Input value={channelSecret} onChange={(e) => setChannelSecret(e.target.value)} type="password" placeholder="貼上 Secret（僅此畫面輸入）" className="border-2 border-foreground bg-background" />
                          </label>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button
                            onClick={() => {
                              if (!channelId || !channelSecret) {
                                toast.error("請先填入 Channel ID 與 Channel Secret");
                                return;
                              }
                              toast.info("已完成前端設定檢查；下一步要把憑證放進後端 Secrets 才能真正連線。", { duration: 4500 });
                            }}
                            className="border-2 border-foreground shadow-[3px_3px_0_var(--foreground)]"
                          >
                            儲存並進行下一步 <ChevronRight className="ml-1 size-4" />
                          </Button>
                          <Button variant="outline" onClick={() => window.open("https://developers.line.biz/console/", "_blank")}>
                            開啟 LINE Developers <ExternalLink className="ml-1 size-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {!lineOpen && (
                      <Button className="mt-4 w-full border-2 border-foreground shadow-[3px_3px_0_var(--foreground)]" onClick={() => setLineOpen(true)}>
                        開始設定 LINE <ChevronRight className="ml-1 size-4" />
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <ol className="space-y-2 text-sm">
                      {i.steps.map((s, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-xs text-secondary-foreground">{idx + 1}</span>
                          <span className="text-muted-foreground">{s}</span>
                        </li>
                      ))}
                    </ol>
                    <p className="mt-4 text-xs text-muted-foreground">{i.detail}</p>
                    <Button className="mt-4 w-full" variant="outline" onClick={() => toast.info(`先完成 LINE 串接後，再來接「${i.name}」。`)}>
                      稍後設定 <Copy className="ml-1 size-4" />
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 border-2 border-foreground bg-foreground p-4 text-primary">
        <p className="text-xs font-black uppercase tracking-[0.2em]">NEXT</p>
        <p className="mt-1 text-lg font-black">LINE 串好後 → 接通知規則 → 發送第一則測試訊息</p>
        <p className="mt-1 text-sm opacity-80">目前這一步只建立安全的設定入口，還不會把 Secret 或 Token 寫入 GitHub。</p>
      </div>
    </AdminShell>
  );
}
