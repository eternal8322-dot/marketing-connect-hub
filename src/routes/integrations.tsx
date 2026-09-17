import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, queryOptions } from "@tanstack/react-query";
import { Check, ExternalLink, KeyRound, MessageCircle, RefreshCw, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { integrations } from "@/lib/mock-data";
import { getIntegrationStatus, verifyLineConnection } from "@/lib/integrations.functions";

const statusQuery = queryOptions({
  queryKey: ["integration-status"],
  queryFn: () => getIntegrationStatus(),
});

export const Route = createFileRoute("/integrations")({
  head: () => ({
    meta: [
      { title: "串接設定 | 行銷數據後台" },
      { name: "description", content: "檢視 Meta 廣告、Google 廣告與 LINE 通知的串接狀態，金鑰全部存放在後端。" },
      { property: "og:title", content: "串接設定 | 行銷數據後台" },
      { property: "og:description", content: "檢視 Meta 廣告、Google 廣告與 LINE 通知的串接狀態，金鑰全部存放在後端。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(statusQuery),
  component: Integrations,
});

type StatusGroup = { secrets: Record<string, boolean>; connected: boolean };

function Integrations() {
  const { data, refetch, isFetching } = useQuery(statusQuery);

  const verify = useMutation({
    mutationFn: () => verifyLineConnection(),
    onSuccess: (r) => (r.ok ? toast.success(r.message) : toast.error(r.message)),
    onError: () => toast.error("測試失敗，請稍後再試"),
  });

  const groups: Record<string, StatusGroup | undefined> = {
    meta: data?.meta,
    google: data?.google,
    line: data?.line,
  };

  return (
    <AdminShell title="串接設定" subtitle="所有金鑰都存放在後端 Secrets，這個頁面只顯示設定狀態。">
      <div className="mb-5 flex flex-wrap items-center gap-2 rounded-lg border-2 border-foreground bg-primary px-4 py-3 text-sm font-semibold shadow-[4px_4px_0_var(--foreground)]">
        <ShieldCheck className="size-5" />
        <span>金鑰由伺服器端讀取，不會出現在瀏覽器</span>
        <Button
          size="sm"
          variant="outline"
          className="ml-auto border-2 border-foreground bg-background"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`mr-1 size-4 ${isFetching ? "animate-spin" : ""}`} /> 重新檢查
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {integrations.map((i) => {
          const group = groups[i.id];
          const connected = group?.connected ?? false;
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
                <Badge variant="outline" className="shrink-0 border-2">
                  {connected ? "已設定" : "尚未設定"}
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <ul className="space-y-2 text-sm">
                  {Object.entries(group?.secrets ?? {}).map(([name, ok]) => (
                    <li key={name} className="flex items-center gap-2 border-2 border-foreground bg-background px-3 py-2">
                      {ok ? <Check className="size-4 shrink-0" /> : <X className="size-4 shrink-0 text-muted-foreground" />}
                      <code className="text-xs font-semibold">{name}</code>
                      <span className="ml-auto text-xs text-muted-foreground">{ok ? "已在後端設定" : "缺少"}</span>
                    </li>
                  ))}
                </ul>

                <ol className="mt-4 space-y-2 text-xs text-muted-foreground">
                  {i.steps.map((s, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] text-secondary-foreground">{idx + 1}</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>

                {isLine ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      className="border-2 border-foreground shadow-[3px_3px_0_var(--foreground)]"
                      onClick={() => verify.mutate()}
                      disabled={verify.isPending || !connected}
                    >
                      {verify.isPending ? "測試中…" : "測試 LINE 連線"}
                    </Button>
                    <Button variant="outline" onClick={() => window.open("https://developers.line.biz/console/", "_blank")}>
                      開啟 LINE Developers <ExternalLink className="ml-1 size-4" />
                    </Button>
                  </div>
                ) : (
                  <p className="mt-4 text-xs text-muted-foreground">
                    缺少的項目請到專案設定的 Secrets 新增，名稱需與上方完全相同。
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AdminShell>
  );
}
