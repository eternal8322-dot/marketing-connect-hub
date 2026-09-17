import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BellRing, CheckCircle2, MessageCircle, Send, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { notificationLog, notificationRules } from "@/lib/mock-data";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "LINE 通知設定 | 行銷數據後台" },
      { name: "description", content: "設定廣告花費、ROAS 與日報的 LINE 推播規則，並檢視通知紀錄。" },
      { property: "og:title", content: "LINE 通知設定 | 行銷數據後台" },
      { property: "og:description", content: "設定廣告花費、ROAS 與日報的 LINE 推播規則，並檢視通知紀錄。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Notifications,
});

function Notifications() {
  const [rules, setRules] = useState(notificationRules);

  return (
    <AdminShell title="LINE 通知" subtitle="先設定規則；完成 LINE 串接後，這些通知就能真正送出去。">
      <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_auto]">
        <Card className="border-4 bg-primary shadow-[6px_6px_0_var(--foreground)]">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
            <div className="flex size-12 shrink-0 items-center justify-center border-2 border-foreground bg-background">
              <MessageCircle className="size-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-black">LINE 目前尚未連線</p>
                <Badge className="border-2 border-foreground bg-background text-foreground">DEMO</Badge>
              </div>
              <p className="mt-1 text-sm text-foreground/70">通知規則可以先編好。完成 Messaging API 設定後，就能從這裡測試推播。</p>
            </div>
            <Button variant="outline" className="border-2 border-foreground bg-background" onClick={() => toast.info("請到「串接設定」完成 LINE Messaging API 設定。") }>
              <Settings2 className="mr-2 size-4" />
              前往串接
            </Button>
          </CardContent>
        </Card>
        <div className="flex items-center justify-center border-2 border-foreground bg-foreground px-5 py-4 text-primary lg:min-w-52 lg:flex-col lg:items-start">
          <BellRing className="size-7" />
          <div className="ml-3 lg:ml-0 lg:mt-3">
            <p className="text-xs font-bold uppercase tracking-widest opacity-70">ACTIVE RULES</p>
            <p className="text-2xl font-black">{rules.filter((r) => r.enabled).length}<span className="ml-1 text-sm font-semibold">/ {rules.length}</span></p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">通知規則</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">開啟後，條件成立時才會觸發通知。</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => toast.info("LINE 尚未連線，完成串接後即可測試。") }>
              <Send className="mr-2 size-4" />
              測試通知
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {rules.map((r) => (
              <div key={r.id} className="flex items-start justify-between gap-4 border-2 border-foreground bg-background p-4 transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5">
                <div>
                  <div className="flex items-center gap-2">
                    {r.enabled && <CheckCircle2 className="size-4" />}
                    <p className="text-sm font-bold">{r.name}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{r.condition}</p>
                  <p className="mt-1 text-xs font-medium">接收對象：{r.target}</p>
                </div>
                <Switch
                  checked={r.enabled}
                  onCheckedChange={(v) => {
                    setRules((prev) => prev.map((x) => (x.id === r.id ? { ...x, enabled: v } : x)));
                    toast.success(`${r.name}已${v ? "開啟" : "關閉"}`);
                  }}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">通知紀錄</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">目前為示範資料；正式串接後會改成真實推播紀錄。</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {notificationLog.map((l, i) => (
              <div key={i} className="border-2 border-foreground p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold">{l.rule}</p>
                  <Badge variant={l.status === "已送達" ? "secondary" : "outline"}>{l.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{l.text}</p>
                <p className="mt-1 text-xs text-muted-foreground">{l.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
