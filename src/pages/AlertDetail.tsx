import { useParams, Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  Clock,
  User,
  Monitor,
  MapPin,
  CheckCircle,
  XCircle,
  MessageSquare,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { alerts, devices, sites, tenants } from '@/data/demoData';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

const severityConfig = {
  critical: { label: '重大', class: 'status-critical' },
  high: { label: '高', class: 'status-warning' },
  medium: { label: '中', class: 'status-info' },
  low: { label: '低', class: 'status-offline' },
};

const statusLabels = {
  new: '新規',
  acknowledged: '確認済み',
  investigating: '調査中',
  resolved: '解決済み',
};

export default function AlertDetail() {
  const { id } = useParams<{ id: string }>();
  const alert = alerts.find((a) => a.id === id);

  if (!alert) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">アラートが見つかりません</h2>
          <Link to="/alerts">
            <Button className="mt-4">アラート一覧に戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

  const device = devices.find((d) => d.id === alert.deviceId);
  const site = sites.find((s) => s.id === alert.siteId);
  const tenant = tenants.find((t) => t.id === alert.tenantId);
  const config = severityConfig[alert.severity];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link to="/alerts">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <span className={cn('status-badge', config.class)}>
                <AlertTriangle className="h-3 w-3" />
                {config.label}
              </span>
              <span
                className={cn(
                  'rounded px-2 py-0.5 text-xs font-medium',
                  alert.status === 'new' && 'bg-status-critical-bg text-status-critical',
                  alert.status === 'acknowledged' && 'bg-status-warning-bg text-status-warning',
                  alert.status === 'investigating' && 'bg-status-info-bg text-status-info',
                  alert.status === 'resolved' && 'bg-status-healthy-bg text-status-healthy'
                )}
              >
                {statusLabels[alert.status]}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold">{alert.title}</h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {format(new Date(alert.createdAt), 'yyyy/MM/dd HH:mm:ss', { locale: ja })}
              </span>
              {alert.assignee && (
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {alert.assignee}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {alert.status === 'new' && (
            <Button className="gap-2">
              <CheckCircle className="h-4 w-4" />
              確認済みにする
            </Button>
          )}
          {alert.status !== 'resolved' && (
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              チケット作成
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Alert Details */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold">詳細</h2>
            <p className="mt-4 text-muted-foreground">{alert.message}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">アラート種別</p>
                <p className="mt-1 font-medium capitalize">{alert.type}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">影響範囲</p>
                <p className="mt-1 font-medium">端末1台</p>
              </div>
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold">推奨対応手順</h2>
            <div className="mt-4 space-y-3">
              {[
                '1. 対象端末のステータスを確認',
                '2. リモートログを確認し、エラー原因を特定',
                '3. 可能であればリモートで復旧を試行',
                '4. 復旧不可の場合、現地対応を手配',
                '5. 対応完了後、アラートを解決済みに更新',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {i + 1}
                  </div>
                  <p className="text-sm">{step.substring(3)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold">タイムライン</h2>
            <div className="mt-4 space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-status-critical" />
                  <div className="flex-1 w-px bg-border" />
                </div>
                <div className="pb-4">
                  <p className="font-medium">アラート発生</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(alert.createdAt), 'yyyy/MM/dd HH:mm:ss', { locale: ja })}
                  </p>
                  <p className="mt-2 text-sm">{alert.message}</p>
                </div>
              </div>
              {alert.acknowledgedAt && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-status-warning" />
                    <div className="flex-1 w-px bg-border" />
                  </div>
                  <div className="pb-4">
                    <p className="font-medium">確認済み</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(alert.acknowledgedAt), 'yyyy/MM/dd HH:mm:ss', { locale: ja })}
                    </p>
                    {alert.assignee && (
                      <p className="mt-2 text-sm">担当者: {alert.assignee}</p>
                    )}
                  </div>
                </div>
              )}
              {alert.resolvedAt && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-status-healthy" />
                  </div>
                  <div>
                    <p className="font-medium">解決済み</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(alert.resolvedAt), 'yyyy/MM/dd HH:mm:ss', { locale: ja })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Device Info */}
          {device && (
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold">対象端末</h3>
              <Link
                to={`/devices/${device.id}`}
                className="mt-4 block rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-muted-foreground" />
                    <span className="font-mono font-medium">{device.deviceCode}</span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{device.model}</p>
              </Link>
            </div>
          )}

          {/* Location */}
          {site && (
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold">拠点情報</h3>
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{site.name}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{site.address}</p>
                <p className="mt-1 text-sm text-muted-foreground">{tenant?.name}</p>
              </div>
            </div>
          )}

          {/* Similar Alerts */}
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold">類似アラート</h3>
            <div className="mt-4 space-y-2">
              {alerts
                .filter((a) => a.id !== alert.id && a.type === alert.type)
                .slice(0, 3)
                .map((similarAlert) => (
                  <Link
                    key={similarAlert.id}
                    to={`/alerts/${similarAlert.id}`}
                    className="block rounded-lg border p-2 text-sm transition-colors hover:bg-muted/50"
                  >
                    <p className="line-clamp-1">{similarAlert.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(similarAlert.createdAt), { addSuffix: true, locale: ja })}
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
