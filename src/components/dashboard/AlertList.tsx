import { AlertTriangle, AlertCircle, Info, Clock, User } from 'lucide-react';
import { Alert as AlertData, devices, sites, tenants } from '@/data/demoData';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

interface AlertListProps {
  alerts: AlertData[];
  maxItems?: number;
  showDevice?: boolean;
}

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    class: 'status-critical',
    rowClass: 'data-row-critical',
    label: '重大',
  },
  high: {
    icon: AlertCircle,
    class: 'status-warning',
    rowClass: '',
    label: '高',
  },
  medium: {
    icon: Info,
    class: 'status-info',
    rowClass: '',
    label: '中',
  },
  low: {
    icon: Info,
    class: 'status-offline',
    rowClass: '',
    label: '低',
  },
};

export function AlertList({ alerts, maxItems = 10, showDevice = true }: AlertListProps) {
  const displayAlerts = alerts.slice(0, maxItems);

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="font-semibold">直近のアラート</h3>
        <span className="text-sm text-muted-foreground">{alerts.length}件</span>
      </div>
      <div className="divide-y">
        {displayAlerts.map((alert) => {
          const config = severityConfig[alert.severity];
          const SeverityIcon = config.icon;
          const device = devices.find((d) => d.id === alert.deviceId);
          const site = sites.find((s) => s.id === alert.siteId);
          const tenant = tenants.find((t) => t.id === alert.tenantId);

          return (
            <div
              key={alert.id}
              className={cn('flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50', config.rowClass)}
            >
              <div className={cn('status-badge mt-0.5', config.class)}>
                <SeverityIcon className="h-3 w-3" />
                {config.label}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{alert.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                  {alert.message}
                </p>
                {showDevice && device && (
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{device.deviceCode}</span>
                    <span>•</span>
                    <span>{site?.name}</span>
                    <span>•</span>
                    <span>{tenant?.name}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true, locale: ja })}
                </div>
                {alert.assignee && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {alert.assignee}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {alerts.length > maxItems && (
        <div className="border-t px-4 py-2">
          <button className="text-sm text-primary hover:underline">
            すべて表示 ({alerts.length}件)
          </button>
        </div>
      )}
    </div>
  );
}
