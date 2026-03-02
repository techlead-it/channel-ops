import React, { useState, useMemo } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Search,
  Filter,
  Bell,
  ChevronDown,
  Clock,
  User,
  ExternalLink,
  CheckCircle,
  XCircle,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { alerts, devices, sites, tenants, Alert } from '@/data/demoData';
import { cn } from '@/lib/utils';
import { formatDistanceToNow, format, differenceInMinutes } from 'date-fns';
import { ja } from 'date-fns/locale';
import { BulkActions, useSelection } from '@/components/shared/BulkActions';
import { RealTimeIndicator, useAutoRefresh } from '@/components/shared/RealTimeIndicator';
import { SimilarIncidents } from '@/components/shared/SimilarIncidents';
import { EscalationRules } from '@/components/shared/EscalationRules';
import { Checkbox } from '@/components/ui/checkbox';

interface LayoutContext {
  selectedTenant: string | null;
  selectedSite: string | null;
}

const severityConfig = {
  critical: {
    label: '重大',
    icon: AlertTriangle,
    class: 'status-critical',
    bgClass: 'bg-status-critical-bg border-status-critical',
  },
  high: {
    label: '高',
    icon: AlertCircle,
    class: 'status-warning',
    bgClass: 'bg-status-warning-bg border-status-warning',
  },
  medium: {
    label: '中',
    icon: Info,
    class: 'status-info',
    bgClass: 'bg-status-info-bg border-status-info',
  },
  low: {
    label: '低',
    icon: Info,
    class: 'status-offline',
    bgClass: 'bg-muted border-border',
  },
};

const statusFilters = ['すべて', 'new', 'acknowledged', 'investigating', 'resolved'];
const statusLabels = {
  new: '新規',
  acknowledged: '確認済み',
  investigating: '調査中',
  resolved: '解決済み',
};

export default function AlertMonitor() {
  const { selectedTenant, selectedSite } = useOutletContext<LayoutContext>();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('すべて');
  const [statusFilter, setStatusFilter] = useState<string>('すべて');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const {
    selectedIds,
    selectedCount,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
  } = useSelection<Alert>();

  // Auto-refresh
  const refreshData = React.useCallback(() => {
    console.log('Refreshing alerts...');
  }, []);

  const { isLive, setIsLive, lastUpdated, refresh } = useAutoRefresh(refreshData, 15000);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      if (selectedTenant && alert.tenantId !== selectedTenant) return false;
      if (selectedSite && alert.siteId !== selectedSite) return false;
      if (severityFilter !== 'すべて' && alert.severity !== severityFilter) return false;
      if (statusFilter !== 'すべて' && alert.status !== statusFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          alert.title.toLowerCase().includes(query) ||
          alert.message.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [selectedTenant, selectedSite, severityFilter, statusFilter, searchQuery]);

  const severityCounts = useMemo(() => {
    const openAlerts = alerts.filter((a) => a.status !== 'resolved');
    return {
      critical: openAlerts.filter((a) => a.severity === 'critical').length,
      high: openAlerts.filter((a) => a.severity === 'high').length,
      medium: openAlerts.filter((a) => a.severity === 'medium').length,
      low: openAlerts.filter((a) => a.severity === 'low').length,
    };
  }, []);

  const handleBulkAction = (action: string) => {
    console.log('Bulk action:', action, 'on', selectedCount, 'alerts');
    clearSelection();
  };

  return (
    <div className="flex h-full gap-6">
      {/* Main List */}
      <div className="flex flex-1 flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">監視・アラート（NOC）</h1>
            <p className="mt-1 text-muted-foreground">
              {filteredAlerts.length}件のアラート
            </p>
          </div>
          <div className="flex items-center gap-3">
            <RealTimeIndicator
              lastUpdated={lastUpdated}
              isLive={isLive}
              onToggleLive={setIsLive}
              onRefresh={refresh}
            />
            <Button
              variant={soundEnabled ? 'default' : 'outline'}
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
            <Button variant="outline" className="gap-2">
              <Bell className="h-4 w-4" />
              通知設定
            </Button>
          </div>
        </div>

        {/* Severity Summary */}
        <div className="grid grid-cols-4 gap-3">
          {(Object.entries(severityConfig) as [Alert['severity'], typeof severityConfig.critical][]).map(
            ([severity, config]) => {
              const count = severityCounts[severity];
              const Icon = config.icon;
              return (
                <button
                  key={severity}
                  onClick={() =>
                    setSeverityFilter(severityFilter === severity ? 'すべて' : severity)
                  }
                  className={cn(
                    'flex items-center justify-between rounded-lg border p-3 transition-all',
                    severityFilter === severity
                      ? config.bgClass
                      : 'bg-card hover:bg-muted/50',
                    severity === 'critical' && count > 0 && 'animate-pulse-slow'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={cn('h-5 w-5', config.class.replace('status-', 'text-status-'))} />
                    <span className="font-medium">{config.label}</span>
                  </div>
                  <span className="font-mono-num text-2xl font-bold">{count}</span>
                </button>
              );
            }
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="アラートを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-enterprise w-full pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                ステータス: {statusFilter === 'すべて' ? 'すべて' : statusLabels[statusFilter as keyof typeof statusLabels]}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {statusFilters.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(statusFilter === status && 'bg-accent')}
                >
                  {status === 'すべて' ? status : statusLabels[status as keyof typeof statusLabels]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Alert List */}
        <div className="flex-1 overflow-auto rounded-lg border bg-card">
          <div className="divide-y">
            {filteredAlerts.map((alert) => {
              const config = severityConfig[alert.severity];
              const SeverityIcon = config.icon;
              const device = devices.find((d) => d.id === alert.deviceId);
              const site = sites.find((s) => s.id === alert.siteId);
              const tenant = tenants.find((t) => t.id === alert.tenantId);

              return (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-muted/50',
                    selectedAlert?.id === alert.id && 'bg-accent',
                    alert.severity === 'critical' && alert.status === 'new' && 'bg-status-critical-bg',
                    isSelected(alert.id) && 'bg-primary/5'
                  )}
                >
                  <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected(alert.id)}
                      onCheckedChange={() => toggleSelection(alert.id)}
                    />
                  </div>
                  <div className={cn('status-badge mt-0.5', config.class)}>
                    <SeverityIcon className="h-3 w-3" />
                    {config.label}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                      <Link
                        to={`/alerts/${alert.id}`}
                        className="font-medium hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {alert.title}
                      </Link>
                      <span
                        className={cn(
                          'ml-2 shrink-0 rounded px-2 py-0.5 text-xs',
                          alert.status === 'new' && 'bg-status-critical-bg text-status-critical',
                          alert.status === 'acknowledged' && 'bg-status-warning-bg text-status-warning',
                          alert.status === 'investigating' && 'bg-status-info-bg text-status-info',
                          alert.status === 'resolved' && 'bg-status-healthy-bg text-status-healthy'
                        )}
                      >
                        {statusLabels[alert.status]}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                      {alert.message}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="font-mono">{device?.deviceCode}</span>
                      <span>{site?.name}</span>
                      <span>{tenant?.name}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(alert.createdAt), {
                          addSuffix: true,
                          locale: ja,
                        })}
                      </div>
                      {alert.assignee && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {alert.assignee}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedAlert && (
        <div className="w-[400px] shrink-0 animate-slide-in-right overflow-auto space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <span
                  className={cn(
                    'status-badge',
                    severityConfig[selectedAlert.severity].class
                  )}
                >
                  {React.createElement(severityConfig[selectedAlert.severity].icon, {
                    className: 'h-3 w-3',
                  })}
                  {severityConfig[selectedAlert.severity].label}
                </span>
                <h2 className="mt-2 text-lg font-semibold">{selectedAlert.title}</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedAlert(null)}>
                <XCircle className="h-4 w-4" />
              </Button>
            </div>

            <p className="mt-3 text-sm text-muted-foreground">{selectedAlert.message}</p>

            {/* Device Info */}
            <div className="mt-6">
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">対象端末</h3>
              {(() => {
                const device = devices.find((d) => d.id === selectedAlert.deviceId);
                const site = sites.find((s) => s.id === selectedAlert.siteId);
                return device ? (
                  <Link
                    to={`/devices/${device.id}`}
                    className="block rounded-lg border bg-muted/30 p-3 hover:bg-muted/50 transition-colors"
                  >
                    <p className="font-mono font-medium">{device.deviceCode}</p>
                    <p className="text-sm text-muted-foreground">{device.model}</p>
                    <p className="mt-1 text-sm">{site?.name}</p>
                  </Link>
                ) : null;
              })()}
            </div>

            {/* Timeline */}
            <div className="mt-6">
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">タイムライン</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-status-critical" />
                    <div className="flex-1 w-px bg-border" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">アラート発生</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(selectedAlert.createdAt), 'yyyy/MM/dd HH:mm:ss', { locale: ja })}
                    </p>
                  </div>
                </div>
                {selectedAlert.acknowledgedAt && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-status-warning" />
                      <div className="flex-1 w-px bg-border" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">確認済み</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(selectedAlert.acknowledgedAt), 'yyyy/MM/dd HH:mm:ss', { locale: ja })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="mt-6">
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">推奨手順</h3>
              <div className="space-y-2">
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-sm">1. 対象端末のステータスを確認</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-sm">2. リモートログを確認</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-sm">3. 必要に応じて現地対応を手配</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 space-y-2">
              <Button className="w-full gap-2">
                <Zap className="h-4 w-4" />
                自動復旧を実行
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <CheckCircle className="h-4 w-4" />
                確認済みにする
              </Button>
              <Button variant="outline" className="w-full gap-2">
                チケット作成
              </Button>
              <Button variant="outline" className="w-full gap-2" asChild>
                <Link to={`/alerts/${selectedAlert.id}`}>
                  <ExternalLink className="h-4 w-4" />
                  詳細画面へ
                </Link>
              </Button>
            </div>
          </div>

          {/* Escalation Rules */}
          <EscalationRules
            alertSeverity={selectedAlert.severity}
            currentMinutesSinceCreation={differenceInMinutes(new Date(), new Date(selectedAlert.createdAt))}
          />

          {/* Similar Incidents */}
          <SimilarIncidents
            currentAlertTitle={selectedAlert.title}
            deviceType={devices.find((d) => d.id === selectedAlert.deviceId)?.type || ''}
            alertType={selectedAlert.type}
          />
        </div>
      )}

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedCount}
        onClearSelection={clearSelection}
        onAction={handleBulkAction}
        entityType="alert"
      />
    </div>
  );
}
