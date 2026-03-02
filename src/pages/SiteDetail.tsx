import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  ArrowLeft,
  Monitor,
  AlertTriangle,
  CheckCircle,
  Activity,
  Phone,
  Mail,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sites, devices, tenants, alerts } from '@/data/demoData';
import { cn } from '@/lib/utils';

const statusConfig = {
  online: { label: '稼働中', icon: CheckCircle, class: 'status-healthy' },
  warning: { label: '警告', icon: AlertTriangle, class: 'status-warning' },
  error: { label: '障害', icon: AlertTriangle, class: 'status-critical' },
  offline: { label: 'オフライン', class: 'status-offline' },
  maintenance: { label: 'メンテ中', class: 'status-info' },
};

export default function SiteDetail() {
  const { id } = useParams<{ id: string }>();
  const site = sites.find((s) => s.id === id);

  if (!site) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">拠点が見つかりません</h2>
          <Link to="/">
            <Button className="mt-4">ダッシュボードに戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

  const tenant = tenants.find((t) => t.id === site.tenantId);
  const siteDevices = devices.filter((d) => d.siteId === site.id);
  const siteAlerts = alerts.filter((a) => a.siteId === site.id && a.status !== 'resolved');

  const statusCounts = siteDevices.reduce((acc, d) => {
    acc[d.status] = (acc[d.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{site.name}</h1>
            <p className="mt-1 text-muted-foreground">{tenant?.name}</p>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {site.address}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 text-center">
          <Monitor className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-2 text-2xl font-bold">{siteDevices.length}</p>
          <p className="text-sm text-muted-foreground">端末数</p>
        </div>
        <div className="rounded-lg border bg-status-healthy-bg p-4 text-center">
          <CheckCircle className="mx-auto h-6 w-6 text-status-healthy" />
          <p className="mt-2 text-2xl font-bold">{statusCounts.online || 0}</p>
          <p className="text-sm text-muted-foreground">稼働中</p>
        </div>
        <div className="rounded-lg border bg-status-critical-bg p-4 text-center">
          <AlertTriangle className="mx-auto h-6 w-6 text-status-critical" />
          <p className="mt-2 text-2xl font-bold">{siteAlerts.length}</p>
          <p className="text-sm text-muted-foreground">アラート</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <Activity className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-2 text-2xl font-bold">
            {siteDevices.length > 0
              ? (((statusCounts.online || 0) / siteDevices.length) * 100).toFixed(1)
              : 0}
            %
          </p>
          <p className="text-sm text-muted-foreground">稼働率</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Devices */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold">端末一覧</h2>
            <div className="mt-4 space-y-3">
              {siteDevices.map((device) => {
                const config = statusConfig[device.status];
                return (
                  <Link
                    key={device.id}
                    to={`/devices/${device.id}`}
                    className={cn(
                      'flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50',
                      device.status === 'error' && 'border-status-critical bg-status-critical-bg'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Monitor className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-mono font-medium">{device.deviceCode}</p>
                        <p className="text-sm text-muted-foreground">{device.type} • {device.model}</p>
                      </div>
                    </div>
                    <span className={cn('status-badge', config.class)}>
                      {config.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact */}
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold">連絡先</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>03-1234-5678</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>support@example.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>9:00 - 17:00</span>
              </div>
            </div>
          </div>

          {/* Active Alerts */}
          {siteAlerts.length > 0 && (
            <div className="rounded-lg border border-status-critical bg-status-critical-bg p-4">
              <h3 className="font-semibold">アクティブアラート</h3>
              <div className="mt-4 space-y-2">
                {siteAlerts.slice(0, 5).map((alert) => (
                  <Link
                    key={alert.id}
                    to={`/alerts/${alert.id}`}
                    className="block rounded-lg bg-card p-2 text-sm hover:bg-muted/50"
                  >
                    <p className="font-medium">{alert.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
