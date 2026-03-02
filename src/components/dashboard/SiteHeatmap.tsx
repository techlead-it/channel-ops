import { sites, devices, tenants, getDevicesBySite } from '@/data/demoData';
import { MapPin, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SiteHeatmapProps {
  selectedTenant: string | null;
}

export function SiteHeatmap({ selectedTenant }: SiteHeatmapProps) {
  const filteredSites = selectedTenant
    ? sites.filter((s) => s.tenantId === selectedTenant)
    : sites;

  const getSiteStatus = (siteId: string) => {
    const siteDevices = getDevicesBySite(siteId);
    const hasError = siteDevices.some((d) => d.status === 'error');
    const hasWarning = siteDevices.some((d) => d.status === 'warning');
    const allOffline = siteDevices.every((d) => d.status === 'offline');

    if (hasError) return 'error';
    if (hasWarning) return 'warning';
    if (allOffline) return 'offline';
    return 'healthy';
  };

  const statusConfig = {
    error: {
      bg: 'bg-status-critical-bg',
      border: 'border-status-critical',
      dot: 'bg-status-critical animate-pulse-slow',
    },
    warning: {
      bg: 'bg-status-warning-bg',
      border: 'border-status-warning',
      dot: 'bg-status-warning',
    },
    offline: {
      bg: 'bg-status-offline-bg',
      border: 'border-status-offline',
      dot: 'bg-status-offline',
    },
    healthy: {
      bg: 'bg-status-healthy-bg',
      border: 'border-status-healthy',
      dot: 'bg-status-healthy',
    },
  };

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="mb-4 font-semibold">拠点別ステータス</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSites.map((site) => {
          const status = getSiteStatus(site.id);
          const config = statusConfig[status];
          const siteDevices = getDevicesBySite(site.id);
          const tenant = tenants.find((t) => t.id === site.tenantId);
          const onlineCount = siteDevices.filter((d) => d.status === 'online').length;
          const errorCount = siteDevices.filter((d) => d.status === 'error').length;

          return (
            <div
              key={site.id}
              className={cn(
                'relative rounded-lg border p-3 transition-all hover:shadow-md cursor-pointer',
                config.bg,
                config.border
              )}
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className={cn('h-2 w-2 rounded-full', config.dot)} />
                    <h4 className="truncate font-medium">{site.name}</h4>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{tenant?.name}</p>
                </div>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Monitor className="h-3 w-3 text-muted-foreground" />
                  <span>{siteDevices.length}台</span>
                </div>
                <div className="flex items-center gap-1 text-status-healthy">
                  <span>稼働 {onlineCount}</span>
                </div>
                {errorCount > 0 && (
                  <div className="flex items-center gap-1 text-status-critical">
                    <span>障害 {errorCount}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
