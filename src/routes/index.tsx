import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { campaigns, currency, dailyPerformance } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "成效總覽 | 行銷數據後台" },
      {
        name: "description",
        content: "整合 Meta 與 Google 廣告成效，搭配 LINE 即時通知的行銷數據後台管理系統。",
      },
      { property: "og:title", content: "成效總覽 | 行銷數據後台" },
      {
        property: "og:description",
        content: "整合 Meta 與 Google 廣告成效，搭配 LINE 即時通知的行銷數據後台管理系統。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const spend = campaigns.reduce((s, c) => s + c.spend, 0);
  const revenue = campaigns.reduce((s, c) => s + c.revenue, 0);
  const clicks = campaigns.reduce((s, c) => s + c.clicks, 0);
  const conversions = campaigns.reduce((s, c) => s + c.conversions, 0);

  const stats = [
    { label: "總廣告花費", value: currency(spend), note: "近 7 日" },
    { label: "總營收", value: currency(revenue), note: "近 7 日" },
    { label: "整體 ROAS", value: (revenue / spend).toFixed(2), note: "營收 ÷ 花費" },
    { label: "轉換次數", value: conversions.toLocaleString("zh-TW"), note: `點擊 ${clicks.toLocaleString("zh-TW")} 次` },
  ];

  return (
    <AdminShell title="成效總覽" subtitle="以下為示範資料，串接後會自動更新為真實廣告數據。">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground">{s.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tracking-tight">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">每日營收走勢</CardTitle>
        </CardHeader>
        <CardContent className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyPerformance}>
              <defs>
                <linearGradient id="metaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="googleFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                  color: "var(--color-popover-foreground)",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="meta"
                name="Meta 營收"
                stroke="var(--color-chart-1)"
                fill="url(#metaFill)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="google"
                name="Google 營收"
                stroke="var(--color-chart-2)"
                fill="url(#googleFill)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {(["meta", "google"] as const).map((ch) => {
          const list = campaigns.filter((c) => c.channel === ch);
          const s = list.reduce((a, c) => a + c.spend, 0);
          const r = list.reduce((a, c) => a + c.revenue, 0);
          return (
            <Card key={ch}>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">{ch === "meta" ? "Meta 廣告" : "Google 廣告"}</CardTitle>
                <Badge variant="secondary">示範資料</Badge>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">花費</span>
                  <span>{currency(s)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">營收</span>
                  <span>{currency(r)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ROAS</span>
                  <span className="font-semibold text-primary">{(r / s).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AdminShell>
  );
}
