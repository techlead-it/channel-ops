import { useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Monitor,
  Activity,
  AlertTriangle,
  Ticket,
  Clock,
  TrendingUp,
  Settings,
  Star,
  History,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { KPICard } from '@/components/dashboard/KPICard';
import { AlertList } from '@/components/dashboard/AlertList';
import { StatusChart } from '@/components/dashboard/StatusChart';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { SiteHeatmap } from '@/components/dashboard/SiteHeatmap';
import { ReleaseProgress } from '@/components/dashboard/ReleaseProgress';
import { RealTimeIndicator, useAutoRefresh } from '@/components/shared/RealTimeIndicator';
import { RecentActivity } from '@/components/shared/RecentActivity';
import { Favorites } from '@/components/shared/Favorites';
import { WelcomeModal, resetWelcomeModal } from '@/components/shared/WelcomeModal';
import { calculateMetrics, alerts, tickets } from '@/data/demoData';

interface LayoutContext {
  selectedTenant: string | null;
  selectedSite: string | null;
}

export default function Dashboard() {
  const { selectedTenant } = useOutletContext<LayoutContext>();
  const metrics = calculateMetrics();
  const [showFavorites, setShowFavorites] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  const openAlerts = alerts.filter((a) => a.status !== 'resolved');
  const openTickets = tickets.filter((t) =>
    ['open', 'in_progress', 'pending'].includes(t.status)
  );

  // Auto-refresh functionality
  const refreshData = useCallback(() => {
    // In real app, this would refetch data
    console.log('Refreshing dashboard data...');
  }, []);

  const { isLive, setIsLive, lastUpdated, refresh } = useAutoRefresh(refreshData, 30000);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">統合ダッシュボード</h1>
          <p className="mt-1 text-muted-foreground">
            チャネル運用プラットフォーム - リアルタイム監視
          </p>
        </div>
        <div className="flex items-center gap-4">
          <RealTimeIndicator
            lastUpdated={lastUpdated}
            isLive={isLive}
            onToggleLive={setIsLive}
            onRefresh={refresh}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowFavorites(!showFavorites)}>
                <Star className="mr-2 h-4 w-4" />
                お気に入り {showFavorites ? '非表示' : '表示'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowActivity(!showActivity)}>
                <History className="mr-2 h-4 w-4" />
                最近の操作 {showActivity ? '非表示' : '表示'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { resetWelcomeModal(); setShowWelcome(true); }}>
                <HelpCircle className="mr-2 h-4 w-4" />
                システム概要を表示
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Welcome Modal */}
      <WelcomeModal forceOpen={showWelcome} onOpenChange={setShowWelcome} />

      {/* Value Proposition Banner */}
      <div className="rounded-lg border bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">統合管理で運用コストを削減</p>
              <p className="text-sm text-muted-foreground">
                台帳・監視・作業・配信を一気通貫で管理。外部決済は接続ハブ方式で短期導入。
              </p>
            </div>
          </div>
          <div className="flex gap-6 text-sm">
            <div className="text-center">
              <p className="font-mono-num text-xl font-bold text-primary">60</p>
              <p className="text-muted-foreground">管理端末数</p>
            </div>
            <div className="text-center">
              <p className="font-mono-num text-xl font-bold text-status-healthy">4</p>
              <p className="text-muted-foreground">テナント</p>
            </div>
            <div className="text-center">
              <p className="font-mono-num text-xl font-bold text-status-warning">3</p>
              <p className="text-muted-foreground">外部接続</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <KPICard
          title="総端末数"
          value={metrics.totalDevices}
          unit="台"
          icon={Monitor}
          variant="primary"
        />
        <KPICard
          title="稼働率"
          value={metrics.onlineRate}
          unit="%"
          icon={Activity}
          trend="up"
          trendValue="前日比 +0.5%"
          variant="success"
        />
        <KPICard
          title="重大アラート"
          value={metrics.criticalAlerts}
          unit="件"
          icon={AlertTriangle}
          variant={metrics.criticalAlerts > 0 ? 'danger' : 'default'}
        />
        <KPICard
          title="未完了チケット"
          value={metrics.openTickets}
          unit="件"
          icon={Ticket}
          variant={metrics.openTickets > 15 ? 'warning' : 'default'}
        />
        <KPICard
          title="平均復旧時間"
          value={metrics.mttr}
          unit="時間"
          icon={Clock}
          trend="down"
          trendValue="改善 -0.3h"
        />
        <KPICard
          title="月間SLA達成"
          value="99.2"
          unit="%"
          icon={TrendingUp}
          variant="success"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Left Column - Charts */}
        <div className="space-y-6 lg:col-span-3">
          <TrendChart />
          <div className="grid gap-6 md:grid-cols-2">
            <SiteHeatmap selectedTenant={selectedTenant} />
            <StatusChart />
          </div>
        </div>

        {/* Right Column - Sidebar Widgets */}
        <div className="space-y-6">
          {/* Favorites */}
          {showFavorites && (
            <Collapsible defaultOpen>
              <div className="rounded-lg border bg-card p-4">
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-status-warning" />
                    <h3 className="font-semibold">お気に入り</h3>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <Favorites editable />
                </CollapsibleContent>
              </div>
            </Collapsible>
          )}

          {/* Recent Activity */}
          {showActivity && (
            <Collapsible defaultOpen>
              <div className="rounded-lg border bg-card p-4">
                <CollapsibleTrigger className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">最近の操作</h3>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <RecentActivity maxItems={5} />
                </CollapsibleContent>
              </div>
            </Collapsible>
          )}

          {/* Release Progress */}
          <ReleaseProgress />
        </div>
      </div>

      {/* Alert List */}
      <AlertList alerts={openAlerts} maxItems={8} />

      {/* Footer: Key Features */}
      <div className="rounded-lg border bg-muted/30 p-4">
        <h3 className="mb-3 font-semibold text-muted-foreground">
          ChannelOps Core の価値
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-card p-3">
            <p className="font-medium">🔗 統合管理</p>
            <p className="mt-1 text-sm text-muted-foreground">
              台帳・監視・作業・配信を一元化
            </p>
          </div>
          <div className="rounded-lg bg-card p-3">
            <p className="font-medium">🌐 接続ハブ</p>
            <p className="mt-1 text-sm text-muted-foreground">
              外部決済・機関連携を短期導入
            </p>
          </div>
          <div className="rounded-lg bg-card p-3">
            <p className="font-medium">📋 テンプレ化</p>
            <p className="mt-1 text-sm text-muted-foreground">
              窓口業務を標準化、差分のみ管理
            </p>
          </div>
          <div className="rounded-lg bg-card p-3">
            <p className="font-medium">🔌 標準IF対応</p>
            <p className="mt-1 text-sm text-muted-foreground">
              CEN/XFS対応でマルチベンダー
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
