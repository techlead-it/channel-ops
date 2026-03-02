import { externalConnections, ExternalConnection } from '@/data/demoData';
import {
  Link2,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Settings,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

const statusConfig = {
  healthy: {
    label: '正常',
    icon: CheckCircle,
    class: 'status-healthy',
    bgClass: 'bg-status-healthy-bg border-status-healthy',
  },
  degraded: {
    label: '低下',
    icon: AlertTriangle,
    class: 'status-warning',
    bgClass: 'bg-status-warning-bg border-status-warning',
  },
  error: {
    label: '障害',
    icon: AlertTriangle,
    class: 'status-critical',
    bgClass: 'bg-status-critical-bg border-status-critical',
  },
};

export default function ConnectionHub() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">外部接続ハブ</h1>
          <p className="mt-1 text-muted-foreground">
            決済・自治体連携・外部機関との接続状況を一元管理
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            全体ヘルスチェック
          </Button>
          <Button className="gap-2">
            <Link2 className="h-4 w-4" />
            接続追加
          </Button>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="rounded-lg border bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-4">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-2">
            <Link2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">PayB接続サービスの思想</p>
            <p className="mt-1 text-sm text-muted-foreground">
              外部決済・外部機関連携を「接続ハブ（クラウド中継）」として提供。
              個別構築不要・短期導入で、複数の決済・機関への接続を一元化します。
            </p>
          </div>
        </div>
      </div>

      {/* Connection Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {externalConnections.map((connection) => {
          const config = statusConfig[connection.status];
          const StatusIcon = config.icon;

          return (
            <div
              key={connection.id}
              className={cn(
                'rounded-lg border p-4 transition-all hover:shadow-md',
                config.bgClass
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={cn('status-badge', config.class)}>
                      <StatusIcon className="h-3 w-3" />
                      {config.label}
                    </span>
                    <span className="rounded bg-muted px-2 py-0.5 text-xs">
                      {connection.type}
                    </span>
                  </div>
                  <h3 className="mt-2 font-semibold">{connection.name}</h3>
                  <p className="text-sm text-muted-foreground">{connection.provider}</p>
                </div>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>

              {/* Metrics */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">レイテンシ</p>
                  <p
                    className={cn(
                      'font-mono-num text-lg font-semibold',
                      connection.latencyMs > 500
                        ? 'text-status-warning'
                        : 'text-foreground'
                    )}
                  >
                    {connection.latencyMs}
                    <span className="text-sm font-normal text-muted-foreground">ms</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">24hメッセージ</p>
                  <p className="font-mono-num text-lg font-semibold">
                    {connection.messageCount24h.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Last Check */}
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  最終チェック:{' '}
                  {formatDistanceToNow(new Date(connection.lastHealthCheck), {
                    addSuffix: true,
                    locale: ja,
                  })}
                </div>
                <Button variant="ghost" size="sm" className="h-6 gap-1 px-2">
                  <ArrowUpRight className="h-3 w-3" />
                  詳細
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connection Templates */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold">接続テンプレート</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          よく使用される接続設定をテンプレートとして管理。金融機関別パラメータも一括設定可能。
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {[
            { name: 'PayB標準', type: '決済', count: 15 },
            { name: 'LGWAN標準', type: '自治体', count: 8 },
            { name: 'J-LIS連携', type: '外部機関', count: 3 },
            { name: 'クレジット決済', type: '決済', count: 12 },
          ].map((template) => (
            <div
              key={template.name}
              className="flex items-center justify-between rounded-lg border bg-muted/30 p-3"
            >
              <div>
                <p className="font-medium">{template.name}</p>
                <p className="text-xs text-muted-foreground">
                  {template.type} • {template.count}件の接続
                </p>
              </div>
              <Button variant="ghost" size="sm">
                利用
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Message Flow Chart */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold">メッセージフロー（24時間）</h2>
        <div className="mt-4 flex items-end gap-1 h-32">
          {Array.from({ length: 24 }).map((_, i) => {
            const height = 20 + Math.random() * 80;
            return (
              <div
                key={i}
                className="flex-1 rounded-t bg-primary/60 transition-all hover:bg-primary"
                style={{ height: `${height}%` }}
                title={`${i}:00`}
              />
            );
          })}
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>0:00</span>
          <span>6:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>
      </div>
    </div>
  );
}
