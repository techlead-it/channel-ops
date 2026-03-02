import { useState, useEffect, useCallback } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  AlertTriangle,
  DollarSign,
  Download,
  Calendar,
  Save,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

// Mock data
const uptimeData = [
  { month: '8月', rate: 99.1 },
  { month: '9月', rate: 99.3 },
  { month: '10月', rate: 98.9 },
  { month: '11月', rate: 99.5 },
  { month: '12月', rate: 99.2 },
  { month: '1月', rate: 99.4 },
];

const incidentsByType = [
  { name: 'ハードウェア', value: 45, color: 'hsl(217, 91%, 60%)' },
  { name: 'ソフトウェア', value: 30, color: 'hsl(142, 71%, 45%)' },
  { name: 'ネットワーク', value: 15, color: 'hsl(38, 92%, 50%)' },
  { name: 'セキュリティ', value: 10, color: 'hsl(0, 84%, 60%)' },
];

const incidentsByTime = [
  { hour: '0', count: 5 },
  { hour: '3', count: 3 },
  { hour: '6', count: 8 },
  { hour: '9', count: 25 },
  { hour: '12', count: 18 },
  { hour: '15', count: 22 },
  { hour: '18', count: 15 },
  { hour: '21', count: 8 },
];

const predictiveData = [
  { device: 'TDB-1-001', component: '紙幣ユニット', riskScore: 85, daysToFailure: 14 },
  { device: 'TDB-2-003', component: 'カードリーダー', riskScore: 72, daysToFailure: 30 },
  { device: 'YKH-4-002', component: 'プリンター', riskScore: 68, daysToFailure: 45 },
  { device: 'MTC-7-001', component: '紙幣ユニット', riskScore: 55, daysToFailure: 60 },
];

const costData = [
  { month: '8月', maintenance: 450, parts: 280, labor: 320 },
  { month: '9月', maintenance: 420, parts: 350, labor: 290 },
  { month: '10月', maintenance: 480, parts: 220, labor: 340 },
  { month: '11月', maintenance: 390, parts: 400, labor: 280 },
  { month: '12月', maintenance: 510, parts: 310, labor: 360 },
  { month: '1月', maintenance: 430, parts: 260, labor: 300 },
];

interface SavedReport {
  id: string;
  name: string;
  description: string | null;
  report_type: string;
  config: Json;
  is_public: boolean;
  created_at: string;
}

export default function Reports() {
  const { user } = useAuth();
  const { trackPageView, trackAction } = useAnalytics();
  const [activeTab, setActiveTab] = useState('uptime');
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportIsPublic, setReportIsPublic] = useState(false);

  useEffect(() => {
    trackPageView('reports');
    if (user) {
      fetchSavedReports();
    }
  }, [user, trackPageView]);

  const fetchSavedReports = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('saved_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedReports((data as SavedReport[]) || []);
    } catch (error) {
      console.error('Error fetching saved reports:', error);
    }
  }, [user]);

  const handleSaveReport = async () => {
    if (!user || !reportName) return;

    try {
      const { error } = await supabase
        .from('saved_reports')
        .insert([{
          user_id: user.id,
          name: reportName,
          description: reportDescription,
          report_type: activeTab,
          config: { tab: activeTab } as Json,
          is_public: reportIsPublic,
        }]);

      if (error) throw error;

      trackAction('save_report', 'reports', { report_type: activeTab });
      setSaveDialogOpen(false);
      setReportName('');
      setReportDescription('');
      setReportIsPublic(false);
      fetchSavedReports();
    } catch (error) {
      console.error('Error saving report:', error);
    }
  };

  const handleExport = () => {
    trackAction('export_report', 'reports', { report_type: activeTab });
    // TODO: Implement actual export
    alert('レポートをエクスポートしました');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">レポート/分析</h1>
          <p className="mt-1 text-muted-foreground">
            稼働率、障害傾向、予兆分析、コスト分析
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            期間: 過去6ヶ月
          </Button>
          {user && (
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Save className="h-4 w-4" />
                  レポート保存
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>レポートを保存</DialogTitle>
                  <DialogDescription>
                    現在のレポート設定を保存して、後から簡単にアクセスできます
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">レポート名</Label>
                    <Input
                      id="name"
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                      placeholder="例: 月次稼働率レポート"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">説明</Label>
                    <Textarea
                      id="description"
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      placeholder="このレポートの目的..."
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="public">他のユーザーに公開</Label>
                    <Switch
                      id="public"
                      checked={reportIsPublic}
                      onCheckedChange={setReportIsPublic}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                    キャンセル
                  </Button>
                  <Button onClick={handleSaveReport} disabled={!reportName}>
                    保存
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            レポート出力
          </Button>
        </div>
      </div>

      {/* Saved Reports */}
      {savedReports.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-sm text-muted-foreground shrink-0">保存済み:</span>
          {savedReports.slice(0, 5).map((report) => (
            <Button
              key={report.id}
              variant="outline"
              size="sm"
              onClick={() => setActiveTab(report.report_type)}
              className="shrink-0"
            >
              {report.name}
            </Button>
          ))}
        </div>
      )}

      {/* KPI Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <Activity className="h-5 w-5 text-muted-foreground" />
            <span className="flex items-center gap-1 text-xs text-status-healthy">
              <TrendingUp className="h-3 w-3" />
              +0.2%
            </span>
          </div>
          <p className="mt-4 font-mono-num text-3xl font-bold">99.4%</p>
          <p className="text-sm text-muted-foreground">月間稼働率</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span className="flex items-center gap-1 text-xs text-status-healthy">
              <TrendingDown className="h-3 w-3" />
              -0.3h
            </span>
          </div>
          <p className="mt-4 font-mono-num text-3xl font-bold">2.4h</p>
          <p className="text-sm text-muted-foreground">平均復旧時間</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <AlertTriangle className="h-5 w-5 text-muted-foreground" />
            <span className="flex items-center gap-1 text-xs text-status-warning">
              <TrendingUp className="h-3 w-3" />
              +5件
            </span>
          </div>
          <p className="mt-4 font-mono-num text-3xl font-bold">127</p>
          <p className="text-sm text-muted-foreground">月間障害件数</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <span className="flex items-center gap-1 text-xs text-status-healthy">
              <TrendingDown className="h-3 w-3" />
              -8%
            </span>
          </div>
          <p className="mt-4 font-mono-num text-3xl font-bold">¥990K</p>
          <p className="text-sm text-muted-foreground">月間保守コスト</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="uptime">稼働率</TabsTrigger>
          <TabsTrigger value="incidents">障害傾向</TabsTrigger>
          <TabsTrigger value="predictive">予兆分析</TabsTrigger>
          <TabsTrigger value="cost">コスト分析</TabsTrigger>
        </TabsList>

        <TabsContent value="uptime" className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold">月間稼働率推移</h2>
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={uptimeData}>
                  <defs>
                    <linearGradient id="colorUptime" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[98, 100]} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="hsl(142, 71%, 45%)"
                    fill="url(#colorUptime)"
                    name="稼働率 (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold">障害種別分布</h2>
              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incidentsByType}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {incidentsByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold">時間帯別障害発生</h2>
              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incidentsByTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(217, 91%, 60%)" name="件数" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold">予兆分析（部品寿命予測）</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              ジャーナル/エラー増加パターンから部品の故障リスクを予測
            </p>
            <div className="mt-6 space-y-4">
              {predictiveData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${
                        item.riskScore >= 80
                          ? 'bg-status-critical-bg'
                          : item.riskScore >= 60
                          ? 'bg-status-warning-bg'
                          : 'bg-status-healthy-bg'
                      }`}
                    >
                      <span
                        className={`font-mono-num font-bold ${
                          item.riskScore >= 80
                            ? 'text-status-critical'
                            : item.riskScore >= 60
                            ? 'text-status-warning'
                            : 'text-status-healthy'
                        }`}
                      >
                        {item.riskScore}
                      </span>
                    </div>
                    <div>
                      <p className="font-mono font-medium">{item.device}</p>
                      <p className="text-sm text-muted-foreground">{item.component}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">推定故障まで</p>
                    <p className="text-lg font-bold">{item.daysToFailure}日</p>
                  </div>
                  <Button variant="outline">予防保守を計画</Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cost" className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold">月間コスト推移</h2>
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="maintenance" stackId="a" fill="hsl(217, 91%, 60%)" name="保守費" />
                  <Bar dataKey="parts" stackId="a" fill="hsl(38, 92%, 50%)" name="部品費" />
                  <Bar dataKey="labor" stackId="a" fill="hsl(142, 71%, 45%)" name="人件費" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
