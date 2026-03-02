import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Monitor,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Wrench,
  Clock,
  MapPin,
  Calendar,
  Shield,
  Cpu,
  HardDrive,
  RefreshCw,
  FileText,
  Activity,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { devices, sites, tenants, alerts, tickets, Device } from '@/data/demoData';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const statusConfig = {
  online: { label: '稼働中', icon: CheckCircle, class: 'status-healthy' },
  warning: { label: '警告', icon: AlertTriangle, class: 'status-warning' },
  error: { label: '障害', icon: XCircle, class: 'status-critical' },
  offline: { label: 'オフライン', icon: XCircle, class: 'status-offline' },
  maintenance: { label: 'メンテ中', icon: Wrench, class: 'status-info' },
};

// Mock metrics data
const generateMetrics = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    cpu: 20 + Math.random() * 40,
    memory: 40 + Math.random() * 30,
    disk: 55 + Math.random() * 10,
  }));
};

export default function DeviceDetail() {
  const { id } = useParams<{ id: string }>();
  const device = devices.find((d) => d.id === id || d.deviceCode === id);
  const [activeTab, setActiveTab] = useState('overview');

  if (!device) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Monitor className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">端末が見つかりません</h2>
          <p className="mt-2 text-muted-foreground">ID: {id}</p>
          <Link to="/devices">
            <Button className="mt-4">端末一覧に戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

  const site = sites.find((s) => s.id === device.siteId);
  const tenant = tenants.find((t) => t.id === device.tenantId);
  const config = statusConfig[device.status];
  const StatusIcon = config.icon;
  const deviceAlerts = alerts.filter((a) => a.deviceId === device.id);
  const deviceTickets = tickets.filter((t) => t.deviceId === device.id);
  const metricsData = generateMetrics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link to="/devices">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-mono">{device.deviceCode}</h1>
              <span className={cn('status-badge', config.class)}>
                <StatusIcon className="h-3 w-3" />
                {config.label}
              </span>
            </div>
            <p className="mt-1 text-muted-foreground">{device.model}</p>
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {site?.name}
              </span>
              <span>{tenant?.name}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            リモート再起動
          </Button>
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            チケット作成
          </Button>
          <Button className="gap-2">
            <Settings className="h-4 w-4" />
            設定
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="hardware">ハードウェア</TabsTrigger>
          <TabsTrigger value="software">ソフトウェア</TabsTrigger>
          <TabsTrigger value="metrics">メトリクス</TabsTrigger>
          <TabsTrigger value="logs">ログ</TabsTrigger>
          <TabsTrigger value="history">履歴</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Basic Info */}
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold">基本情報</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">端末ID</dt>
                  <dd className="font-mono">{device.deviceCode}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">種別</dt>
                  <dd>{device.type}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">メーカー</dt>
                  <dd>{device.manufacturer}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">モデル</dt>
                  <dd>{device.model}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">設置日</dt>
                  <dd>{device.installedDate}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">保証期限</dt>
                  <dd>{device.warrantyExpiry}</dd>
                </div>
              </dl>
            </div>

            {/* Connection Info */}
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold">接続情報</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">OS</dt>
                  <dd>{device.osVersion}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">アプリ版本</dt>
                  <dd className="font-mono">v{device.appVersion}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">最終通信</dt>
                  <dd>
                    {formatDistanceToNow(new Date(device.lastHeartbeat), {
                      addSuffix: true,
                      locale: ja,
                    })}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">IPアドレス</dt>
                  <dd className="font-mono">192.168.1.{Math.floor(Math.random() * 254) + 1}</dd>
                </div>
              </dl>
            </div>

            {/* Quick Stats */}
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold">統計</h3>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-bold text-status-critical">{deviceAlerts.length}</p>
                  <p className="text-xs text-muted-foreground">アラート</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-bold text-status-warning">{deviceTickets.length}</p>
                  <p className="text-xs text-muted-foreground">チケット</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-bold">99.2%</p>
                  <p className="text-xs text-muted-foreground">稼働率</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-bold">1.2h</p>
                  <p className="text-xs text-muted-foreground">MTTR</p>
                </div>
              </div>
            </div>
          </div>

          {/* Modules */}
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold">搭載モジュール</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {device.modules.map((module) => (
                <div
                  key={module.id}
                  className={cn(
                    'flex items-center justify-between rounded-lg border p-3',
                    module.status === 'error' && 'border-status-critical bg-status-critical-bg',
                    module.status === 'warning' && 'border-status-warning bg-status-warning-bg'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Cpu className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{module.type}</p>
                      <p className="text-xs text-muted-foreground">{module.model}</p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'status-badge',
                      module.status === 'ok' && 'status-healthy',
                      module.status === 'warning' && 'status-warning',
                      module.status === 'error' && 'status-critical'
                    )}
                  >
                    {module.status === 'ok' ? '正常' : module.status === 'warning' ? '警告' : '異常'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          {deviceAlerts.length > 0 && (
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold">最近のアラート</h3>
              <div className="mt-4 space-y-2">
                {deviceAlerts.slice(0, 5).map((alert) => (
                  <Link
                    key={alert.id}
                    to={`/alerts/${alert.id}`}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle
                        className={cn(
                          'h-4 w-4',
                          alert.severity === 'critical' && 'text-status-critical',
                          alert.severity === 'high' && 'text-status-warning'
                        )}
                      />
                      <span>{alert.title}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true, locale: ja })}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="hardware" className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold">物理構成</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {device.modules.map((module) => (
                <div key={module.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{module.type}モジュール</h4>
                      <p className="text-sm text-muted-foreground">{module.model}</p>
                    </div>
                    <span
                      className={cn(
                        'status-badge',
                        module.status === 'ok' && 'status-healthy',
                        module.status === 'warning' && 'status-warning',
                        module.status === 'error' && 'status-critical'
                      )}
                    >
                      {module.status === 'ok' ? '正常' : module.status === 'warning' ? '警告' : '異常'}
                    </span>
                  </div>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">最終保守</dt>
                      <dd>{module.lastMaintenance || '未実施'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">シリアル番号</dt>
                      <dd className="font-mono">SN-{Math.random().toString(36).substring(2, 10).toUpperCase()}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="software" className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold">論理構成</h3>
            <div className="mt-6 space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">オペレーティングシステム</h4>
                    <p className="text-sm text-muted-foreground">{device.osVersion}</p>
                  </div>
                  <span className="status-badge status-healthy">最新</span>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">メインアプリケーション</h4>
                    <p className="text-sm text-muted-foreground">ChannelOps Client v{device.appVersion}</p>
                  </div>
                  <span className="status-badge status-warning">更新あり</span>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">セキュリティパッチ</h4>
                    <p className="text-sm text-muted-foreground">2024-01 Security Update</p>
                  </div>
                  <span className="status-badge status-healthy">適用済み</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold">リソース使用状況（24時間）</h3>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metricsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="cpu" stroke="hsl(217, 91%, 60%)" name="CPU %" />
                  <Line type="monotone" dataKey="memory" stroke="hsl(142, 71%, 45%)" name="メモリ %" />
                  <Line type="monotone" dataKey="disk" stroke="hsl(38, 92%, 50%)" name="ディスク %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold">システムログ</h3>
            <div className="mt-4 space-y-2 font-mono text-sm">
              {[
                { time: '10:32:15', level: 'INFO', message: 'Heartbeat sent successfully' },
                { time: '10:31:00', level: 'INFO', message: 'Transaction completed: TXN-20240115-001234' },
                { time: '10:30:45', level: 'WARN', message: 'Cash dispenser low on 10000 yen notes' },
                { time: '10:28:30', level: 'INFO', message: 'Card reader initialized' },
                { time: '10:25:00', level: 'INFO', message: 'System health check passed' },
              ].map((log, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex gap-4 rounded p-2',
                    log.level === 'WARN' && 'bg-status-warning-bg',
                    log.level === 'ERROR' && 'bg-status-critical-bg'
                  )}
                >
                  <span className="text-muted-foreground">{log.time}</span>
                  <span
                    className={cn(
                      'w-12',
                      log.level === 'INFO' && 'text-status-info',
                      log.level === 'WARN' && 'text-status-warning',
                      log.level === 'ERROR' && 'text-status-critical'
                    )}
                  >
                    {log.level}
                  </span>
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold">変更履歴</h3>
            <div className="mt-4 space-y-4">
              {[
                { date: '2024-01-15', action: 'ソフトウェア更新', detail: 'v3.4.2 → v3.5.0', user: '田中 花子' },
                { date: '2024-01-10', action: '定期保守', detail: '紙幣ユニット清掃', user: '山田 太郎' },
                { date: '2023-12-20', action: 'モジュール交換', detail: 'カードリーダー交換', user: '佐藤 次郎' },
                { date: '2023-12-01', action: 'セキュリティパッチ', detail: '2023-12 Security Update', user: 'システム' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 border-l-2 border-primary/30 pl-4">
                  <div className="flex-1">
                    <p className="font-medium">{item.action}</p>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.date} • {item.user}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
