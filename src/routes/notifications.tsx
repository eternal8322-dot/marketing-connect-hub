import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
    <AdminShell title="LINE 通知" subtitle="設定什麼情況要推播到 LINE。目前為示範模式，不會實際送出訊息。">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">通知規則</CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.info("串接 LINE 後即可送出測試訊息")}
            >
              發送測試通知
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {rules.map((r) => (
              <div
                key={r.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-border p-4"
              >
                <div>
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{r.condition}</p>
                  <p className="mt-1 text-xs text-muted-foreground">接收對象：{r.target}</p>
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
          </CardHeader>
          <CardContent className="space-y-3">
            {notificationLog.map((l, i) => (
              <div key={i} className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{l.rule}</p>
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
