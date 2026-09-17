import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { campaigns, currency, type Channel } from "@/lib/mock-data";

export const Route = createFileRoute("/campaigns")({
  head: () => ({
    meta: [
      { title: "廣告活動成效 | 行銷數據後台" },
      { name: "description", content: "檢視 Meta 與 Google 各廣告活動的花費、點擊、轉換與 ROAS。" },
      { property: "og:title", content: "廣告活動成效 | 行銷數據後台" },
      { property: "og:description", content: "檢視 Meta 與 Google 各廣告活動的花費、點擊、轉換與 ROAS。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Campaigns,
});

const statusLabel: Record<string, string> = {
  active: "投放中",
  paused: "已暫停",
  ended: "已結束",
};

function Campaigns() {
  const [filter, setFilter] = useState<Channel | "all">("all");
  const rows = campaigns.filter((c) => filter === "all" || c.channel === filter);

  return (
    <AdminShell title="廣告活動" subtitle="各平台廣告活動的明細成效（示範資料）。">
      <div className="mb-4 flex gap-2">
        {(["all", "meta", "google"] as const).map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "outline"}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "全部" : f === "meta" ? "Meta" : "Google"}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>廣告活動</TableHead>
                <TableHead>平台</TableHead>
                <TableHead>狀態</TableHead>
                <TableHead className="text-right">花費</TableHead>
                <TableHead className="text-right">點擊</TableHead>
                <TableHead className="text-right">轉換</TableHead>
                <TableHead className="text-right">營收</TableHead>
                <TableHead className="text-right">ROAS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.channel === "meta" ? "Meta" : "Google"}</TableCell>
                  <TableCell>
                    <Badge variant={c.status === "active" ? "default" : "secondary"}>
                      {statusLabel[c.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{currency(c.spend)}</TableCell>
                  <TableCell className="text-right">{c.clicks.toLocaleString("zh-TW")}</TableCell>
                  <TableCell className="text-right">{c.conversions}</TableCell>
                  <TableCell className="text-right">{currency(c.revenue)}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {(c.revenue / c.spend).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
