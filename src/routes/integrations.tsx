import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  return (
    <AdminShell title="串接設定" subtitle="想先接哪一個都可以，我們可以一項一項慢慢來。">
      <div className="grid gap-4 lg:grid-cols-3">
        {integrations.map((i) => (
          <Card key={i.id} className="flex flex-col">
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <CardTitle className="text-base">{i.name}</CardTitle>
              <Badge variant="outline">尚未串接</Badge>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <p className="text-sm text-muted-foreground">{i.description}</p>
              <ol className="mt-4 space-y-2 text-sm">
                {i.steps.map((s, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-xs text-secondary-foreground">
                      {idx + 1}
                    </span>
                    <span className="text-muted-foreground">{s}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-xs text-muted-foreground">{i.detail}</p>
              <Button
                className="mt-4 w-full"
                onClick={() => toast.info(`準備好要接「${i.name}」時，在對話中告訴我就可以開始。`)}
              >
                開始串接
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
