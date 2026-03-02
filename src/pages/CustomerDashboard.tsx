import { useOutletContext } from 'react-router-dom';
import {
  Activity,
  Monitor,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { AlertList } from '@/components/dashboard/AlertList';
import { devices, alerts, tickets, sites, tenants } from '@/data/demoData';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

// For demo, assume customer is tenant 't1' (東京第一銀行)
const CUSTOMER_TENANT_ID = 't1';

const statusConfig = {
  online: { label: '稼働中', icon: CheckCircle, class: 'status-healthy' },
  warning: { label: '警告', icon: AlertTriangle, class: 'status-warning' },
  error: { label: '障害', icon: AlertTriangle, class: 'status-critical' },
  offline: { label: 'オフライン', class: 'status-offline' },
  maintenance: { label: 'メンテ中', class: 'status-info' },
};

export default function CustomerDashboard() {
  const tenant = tenants.find((t) => t.id === CUSTOMER_TENANT_ID);
  const customerDevices = devices.filter((d) => d.tenantId === CUSTOMER_TENANT_ID);
  const customerSites = sites.filter((s) => s.tenantId === CUSTOMER_TENANT_ID);
  const customerAlerts = alerts.filter((a) => a.tenantId === CUSTOMER_TENANT_ID && a.status !== 'resolved');

  const onlineDevices = customerDevices.filter((d) => d.status === 'online').length;
  const errorDevices = customerDevices.filter((d) => d.status === 'error').length;
  const onlineRate = ((onlineDevices / customerDevices.length) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">顧客ダッシュボード</p>
        <h1 className="text-2xl font-bold">{tenant?.name}</h1>
        <p className="mt-1 text-muted-foreground">
          自社の端末稼働状況をリアルタイムで確認
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="管理端末数"
          value={customerDevices.length}
          unit="台"
          icon={Monitor}
          variant="primary"
        />
        <KPICard
          title="稼働率"
          value={onlineRate}
          unit="%"
          icon={Activity}
          variant="success"
        />
        <KPICard
          title="アラート"
          value={customerAlerts.length}
          unit="件"
          icon={AlertTriangle}
          variant={customerAlerts.length > 0 ? 'warning' : 'default'}
        />
        <KPICard
          title="拠点数"
          value={customerSites.length}
          unit="拠点"
          icon={CheckCircle}
        />
      </div>

      {/* Sites Overview */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold">拠点別状況</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {customerSites.map((site) => {
            const siteDevices = customerDevices.filter((d) => d.siteId === site.id);
            const siteOnline = siteDevices.filter((d) => d.status === 'online').length;
            const siteErrors = siteDevices.filter((d) => d.status === 'error').length;

            return (
              <Link
                key={site.id}
                to={`/customer/devices?site=${site.id}`}
                className={cn(
                  'rounded-lg border p-4 transition-all hover:shadow-md',
                  siteErrors > 0 && 'border-status-critical bg-status-critical-bg'
                )}
              >
                <h3 className="font-semibold">{site.name}</h3>
                <p className="text-sm text-muted-foreground">{site.address}</p>
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Monitor className="h-4 w-4" />
                    {siteDevices.length}台
                  </span>
                  <span className="flex items-center gap-1 text-status-healthy">
                    稼働 {siteOnline}
                  </span>
                  {siteErrors > 0 && (
                    <span className="flex items-center gap-1 text-status-critical">
                      障害 {siteErrors}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Device List */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold">端末一覧</h2>
        <div className="mt-4 space-y-2">
          {customerDevices.slice(0, 10).map((device) => {
            const config = statusConfig[device.status];
            const site = customerSites.find((s) => s.id === device.siteId);

            return (
              <div
                key={device.id}
                className={cn(
                  'flex items-center justify-between rounded-lg border p-3',
                  device.status === 'error' && 'border-status-critical bg-status-critical-bg'
                )}
              >
                <div className="flex items-center gap-3">
                  <Monitor className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-mono font-medium">{device.deviceCode}</p>
                    <p className="text-sm text-muted-foreground">{site?.name}</p>
                  </div>
                </div>
                <span className={cn('status-badge', config.class)}>
                  {config.label}
                </span>
              </div>
            );
          })}
        </div>
        {customerDevices.length > 10 && (
          <Link to="/customer/devices" className="mt-4 block text-center text-sm text-primary hover:underline">
            すべて表示 ({customerDevices.length}台)
          </Link>
        )}
      </div>

      {/* Alerts */}
      {customerAlerts.length > 0 && (
        <AlertList alerts={customerAlerts} maxItems={5} />
      )}
    </div>
  );
}
