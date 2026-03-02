import { useParams, Link } from 'react-router-dom';
import {
  Link2,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Activity,
  Clock,
  Settings,
  RefreshCw,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { externalConnections } from '@/data/demoData';
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
  healthy: { label: '正常', icon: CheckCircle, class: 'status-healthy' },
  degraded: { label: '低下', icon: AlertTriangle, class: 'status-warning' },
  error: { label: '障害', icon: AlertTriangle, class: 'status-critical' },
};

// Mock latency data
const latencyData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  latency: 40 + Math.random() * 30,
}));

// Mock message data
const messageData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  count: 3000 + Math.random() * 5000,
}));

export default function ConnectionDetail() {
  const { id } = useParams<{ id: string }>();
  const connection = externalConnections.find((c) => c.id === id) || externalConnections[0];

  if (!connection) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Link2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">接続が見つかりません</h2>
          <Link to="/connections">
            <Button className="mt-4">接続一覧に戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

  const config = statusConfig[connection.status];
  const StatusIcon = config.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link to="/connections">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{connection.name}</h1>
              <span className={cn('status-badge', config.class)}>
                <StatusIcon className="h-3 w-3" />
                {config.label}
              </span>
            </div>
            <p className="mt-1 text-muted-foreground">
              {connection.type} • {connection.provider}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            ヘルスチェック
          </Button>
          <Button className="gap-2">
            <Settings className="h-4 w-4" />
            設定
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 text-center">
          <Activity className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-2 font-mono-num text-2xl font-bold">{connection.latencyMs}ms</p>
          <p className="text-sm text-muted-foreground">レイテンシ</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <Clock className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-2 font-mono-num text-2xl font-bold">
            {connection.messageCount24h.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">24h メッセージ</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <CheckCircle className="mx-auto h-6 w-6 text-status-healthy" />
          <p className="mt-2 font-mono-num text-2xl font-bold">99.9%</p>
          <p className="text-sm text-muted-foreground">成功率</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <Shield className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-2 text-lg font-bold">TLS 1.3</p>
          <p className="text-sm text-muted-foreground">暗号化</p>
        </div>
      </div>

      <Tabs defaultValue="metrics">
        <TabsList>
          <TabsTrigger value="metrics">メトリクス</TabsTrigger>
          <TabsTrigger value="config">設定</TabsTrigger>
          <TabsTrigger value="failover">迂回設定</TabsTrigger>
          <TabsTrigger value="logs">ログ</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold">レイテンシ（24時間）</h2>
              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={latencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="latency"
                      stroke="hsl(217, 91%, 60%)"
                      name="レイテンシ (ms)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold">メッセージ数（24時間）</h2>
              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={messageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="hsl(142, 71%, 45%)"
                      name="メッセージ数"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold">接続設定</h2>
            <dl className="mt-6 space-y-4">
              <div className="flex justify-between border-b pb-2">
                <dt className="text-muted-foreground">エンドポイント</dt>
                <dd className="font-mono">https://api.payb.example.com/v1</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-muted-foreground">タイムアウト</dt>
                <dd>30秒</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-muted-foreground">リトライ回数</dt>
                <dd>3回</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-muted-foreground">認証方式</dt>
                <dd>OAuth 2.0 / mTLS</dd>
              </div>
            </dl>
          </div>
        </TabsContent>

        <TabsContent value="failover" className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold">迂回設定</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              プライマリ接続に障害が発生した場合の迂回先を設定します。
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">プライマリ</p>
                  <p className="text-sm text-muted-foreground">api.payb.example.com</p>
                </div>
                <span className="status-badge status-healthy">アクティブ</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">セカンダリ</p>
                  <p className="text-sm text-muted-foreground">backup.payb.example.com</p>
                </div>
                <span className="status-badge status-offline">スタンバイ</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold">接続ログ</h2>
            <div className="mt-6 space-y-2 font-mono text-sm">
              {[
                { time: '10:32:15', level: 'INFO', message: 'Health check passed' },
                { time: '10:31:00', level: 'INFO', message: 'Message processed: TXN-001234' },
                { time: '10:30:45', level: 'WARN', message: 'Latency spike detected: 450ms' },
                { time: '10:28:30', level: 'INFO', message: 'Connection renewed' },
              ].map((log, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex gap-4 rounded p-2',
                    log.level === 'WARN' && 'bg-status-warning-bg'
                  )}
                >
                  <span className="text-muted-foreground">{log.time}</span>
                  <span
                    className={cn(
                      'w-12',
                      log.level === 'INFO' && 'text-status-info',
                      log.level === 'WARN' && 'text-status-warning'
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
      </Tabs>
    </div>
  );
}
