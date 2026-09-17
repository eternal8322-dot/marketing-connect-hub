export type Channel = "meta" | "google";

export type Campaign = {
  id: string;
  name: string;
  channel: Channel;
  status: "active" | "paused" | "ended";
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
};

export const campaigns: Campaign[] = [
  {
    id: "m-101",
    name: "夏季新品｜動態廣告",
    channel: "meta",
    status: "active",
    spend: 48250,
    impressions: 412300,
    clicks: 9820,
    conversions: 318,
    revenue: 268400,
  },
  {
    id: "m-102",
    name: "再行銷｜加入購物車 7 日",
    channel: "meta",
    status: "active",
    spend: 21600,
    impressions: 138900,
    clicks: 5410,
    conversions: 264,
    revenue: 201300,
  },
  {
    id: "m-103",
    name: "粉專互動｜品牌短影音",
    channel: "meta",
    status: "paused",
    spend: 9800,
    impressions: 96400,
    clicks: 1720,
    conversions: 41,
    revenue: 23800,
  },
  {
    id: "g-201",
    name: "搜尋｜品牌關鍵字",
    channel: "google",
    status: "active",
    spend: 33100,
    impressions: 88200,
    clicks: 7130,
    conversions: 402,
    revenue: 351700,
  },
  {
    id: "g-202",
    name: "購物廣告｜熱銷品",
    channel: "google",
    status: "active",
    spend: 52400,
    impressions: 264800,
    clicks: 8640,
    conversions: 356,
    revenue: 312900,
  },
  {
    id: "g-203",
    name: "多媒體｜潛在客群擴散",
    channel: "google",
    status: "ended",
    spend: 14700,
    impressions: 501200,
    clicks: 2210,
    conversions: 58,
    revenue: 34600,
  },
];

export const dailyPerformance = [
  { date: "09/08", meta: 21400, google: 26800, spend: 9800 },
  { date: "09/09", meta: 25800, google: 24900, spend: 10400 },
  { date: "09/10", meta: 19600, google: 31200, spend: 11250 },
  { date: "09/11", meta: 32100, google: 28700, spend: 12100 },
  { date: "09/12", meta: 38400, google: 35600, spend: 13850 },
  { date: "09/13", meta: 44100, google: 41200, spend: 15200 },
  { date: "09/14", meta: 39800, google: 47300, spend: 14600 },
  { date: "09/15", meta: 46200, google: 52400, spend: 16050 },
];

export const channelSplit = [
  { name: "Meta 廣告", value: 493500 },
  { name: "Google 廣告", value: 699200 },
];

export type NotificationRule = {
  id: string;
  name: string;
  condition: string;
  target: string;
  enabled: boolean;
};

export const notificationRules: NotificationRule[] = [
  {
    id: "r1",
    name: "單日花費超標提醒",
    condition: "當日總花費 > NT$15,000",
    target: "行銷主管群組",
    enabled: true,
  },
  {
    id: "r2",
    name: "ROAS 低於門檻",
    condition: "任一廣告組 ROAS < 2.0（連續 2 日）",
    target: "投手群組",
    enabled: true,
  },
  {
    id: "r3",
    name: "每日成效日報",
    condition: "每天 09:00 推送前一日摘要",
    target: "全公司公告",
    enabled: true,
  },
  {
    id: "r4",
    name: "廣告審核未通過",
    condition: "Meta 或 Google 廣告被退件時",
    target: "投手群組",
    enabled: false,
  },
];

export const notificationLog = [
  { time: "09/16 09:00", rule: "每日成效日報", text: "昨日花費 NT$16,050、營收 NT$98,600、ROAS 6.14", status: "已送達" },
  { time: "09/15 21:12", rule: "單日花費超標提醒", text: "今日花費已達 NT$15,240，超出設定上限", status: "已送達" },
  { time: "09/15 14:35", rule: "ROAS 低於門檻", text: "「粉專互動｜品牌短影音」ROAS 2.43 連續下滑", status: "已送達" },
  { time: "09/14 09:00", rule: "每日成效日報", text: "昨日花費 NT$15,200、營收 NT$85,300、ROAS 5.61", status: "已送達" },
  { time: "09/13 18:02", rule: "廣告審核未通過", text: "Google 購物廣告素材待修正", status: "未發送（規則關閉）" },
];

export type Integration = {
  id: string;
  name: string;
  description: string;
  status: "connected" | "pending" | "not_connected";
  detail: string;
  steps: string[];
};

export const integrations: Integration[] = [
  {
    id: "meta",
    name: "Meta 廣告",
    description: "串接粉專與廣告帳號成效，自動同步花費、轉換與 ROAS。",
    status: "not_connected",
    detail: "目前顯示的是示範資料",
    steps: [
      "在 Meta 商業管理平台建立應用程式並取得存取權杖",
      "選擇要同步的廣告帳號",
      "設定同步頻率（建議每小時）",
    ],
  },
  {
    id: "google",
    name: "Google 廣告",
    description: "串接搜尋、購物與多媒體廣告數據，含關鍵字層級成效。",
    status: "not_connected",
    detail: "目前顯示的是示範資料",
    steps: [
      "申請 Google Ads API 開發者權杖",
      "以管理員帳號授權存取客戶編號（MCC）",
      "選擇要同步的廣告帳戶",
    ],
  },
  {
    id: "line",
    name: "LINE 通知",
    description: "把重要成效變化即時推播到 LINE 群組或官方帳號。",
    status: "not_connected",
    detail: "示範模式：通知只會記錄在系統中",
    steps: [
      "建立 LINE Messaging API 官方帳號",
      "取得 Channel access token 與 Channel secret",
      "指定接收通知的群組或使用者",
    ],
  },
];

export const currency = (n: number) => `NT$${n.toLocaleString("zh-TW")}`;
export const compact = (n: number) => n.toLocaleString("zh-TW");
