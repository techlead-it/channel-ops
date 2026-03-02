import { useState, useMemo } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  Monitor,
  Search,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Wrench,
  QrCode,
  ArrowLeftRight,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { devices, sites, tenants, Device } from '@/data/demoData';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { BulkActions, useSelection } from '@/components/shared/BulkActions';
import { SavedViews } from '@/components/shared/SavedViews';
import { ExportDialog } from '@/components/shared/ExportDialog';

interface LayoutContext {
  selectedTenant: string | null;
  selectedSite: string | null;
}

const statusConfig = {
  online: {
    label: '稼働中',
    icon: CheckCircle,
    class: 'status-healthy',
  },
  warning: {
    label: '警告',
    icon: AlertTriangle,
    class: 'status-warning',
  },
  error: {
    label: '障害',
    icon: XCircle,
    class: 'status-critical',
  },
  offline: {
    label: 'オフライン',
    icon: XCircle,
    class: 'status-offline',
  },
  maintenance: {
    label: 'メンテ中',
    icon: Wrench,
    class: 'status-info',
  },
};

const deviceTypeFilters = ['すべて', 'ATM', 'キオスク', '窓口端末', '精算機', 'ロボット'];
const statusFilters = ['すべて', 'online', 'warning', 'error', 'offline', 'maintenance'];

const exportColumns = [
  { id: 'deviceCode', label: '端末ID', default: true },
  { id: 'type', label: '種別', default: true },
  { id: 'model', label: 'モデル', default: true },
  { id: 'site', label: '拠点', default: true },
  { id: 'tenant', label: '顧客', default: true },
  { id: 'status', label: 'ステータス', default: true },
  { id: 'appVersion', label: 'アプリ版本', default: true },
  { id: 'osVersion', label: 'OS', default: false },
  { id: 'manufacturer', label: 'メーカー', default: false },
  { id: 'installedDate', label: '設置日', default: false },
  { id: 'warrantyExpiry', label: '保証期限', default: false },
];

export default function DeviceList() {
  const { selectedTenant, selectedSite } = useOutletContext<LayoutContext>();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('すべて');
  const [statusFilter, setStatusFilter] = useState('すべて');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const {
    selectedIds,
    selectedCount,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
  } = useSelection<Device>();

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      // Tenant filter
      if (selectedTenant && device.tenantId !== selectedTenant) return false;
      // Site filter
      if (selectedSite && device.siteId !== selectedSite) return false;
      // Type filter
      if (typeFilter !== 'すべて' && device.type !== typeFilter) return false;
      // Status filter
      if (statusFilter !== 'すべて' && device.status !== statusFilter) return false;
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const site = sites.find((s) => s.id === device.siteId);
        const tenant = tenants.find((t) => t.id === device.tenantId);
        return (
          device.deviceCode.toLowerCase().includes(query) ||
          device.model.toLowerCase().includes(query) ||
          site?.name.toLowerCase().includes(query) ||
          tenant?.name.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [selectedTenant, selectedSite, typeFilter, statusFilter, searchQuery]);

  const statusCounts = useMemo(() => {
    return filteredDevices.reduce((acc, device) => {
      acc[device.status] = (acc[device.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [filteredDevices]);

  const handleBulkAction = (action: string) => {
    console.log('Bulk action:', action, 'on', selectedCount, 'devices');
    clearSelection();
  };

  const handleApplyView = (filters: Record<string, string>) => {
    if (filters.status) setStatusFilter(filters.status);
    if (filters.type) setTypeFilter(filters.type);
  };

  const currentFilters = {
    status: statusFilter,
    type: typeFilter,
    tenant: selectedTenant || '',
    site: selectedSite || '',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">端末台帳（CMDB）</h1>
          <p className="mt-1 text-muted-foreground">
            {filteredDevices.length}台の端末を管理
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={compareMode ? 'default' : 'outline'}
            className="gap-2"
            onClick={() => setCompareMode(!compareMode)}
          >
            <ArrowLeftRight className="h-4 w-4" />
            比較モード
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => setExportDialogOpen(true)}>
            <Download className="h-4 w-4" />
            CSV出力
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                インポート
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>CSVからインポート</DropdownMenuItem>
              <DropdownMenuItem>Excelからインポート</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>テンプレートをダウンロード</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="gap-2">
            <Monitor className="h-4 w-4" />
            端末追加
          </Button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = statusCounts[status] || 0;
          const Icon = config.icon;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? 'すべて' : status)}
              className={cn(
                'filter-chip',
                statusFilter === status && 'filter-chip-active'
              )}
            >
              <Icon className="h-3 w-3" />
              {config.label}
              <span className="font-mono-num font-semibold">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="端末ID、モデル、拠点で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-enterprise w-full pl-9"
          />
        </div>
        <SavedViews
          currentFilters={currentFilters}
          onApplyView={handleApplyView}
          entityType="device"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              種別: {typeFilter}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {deviceTypeFilters.map((type) => (
              <DropdownMenuItem
                key={type}
                onClick={() => setTypeFilter(type)}
                className={cn(typeFilter === type && 'bg-accent')}
              >
                {type}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" className="gap-2">
          <QrCode className="h-4 w-4" />
          QRスキャン
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedCount === filteredDevices.length && filteredDevices.length > 0}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      selectAll(filteredDevices);
                    } else {
                      clearSelection();
                    }
                  }}
                />
              </TableHead>
              <TableHead>端末ID</TableHead>
              <TableHead>種別</TableHead>
              <TableHead>モデル</TableHead>
              <TableHead>拠点</TableHead>
              <TableHead>顧客</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead>アプリ版本</TableHead>
              <TableHead>最終通信</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDevices.slice(0, 20).map((device) => {
              const site = sites.find((s) => s.id === device.siteId);
              const tenant = tenants.find((t) => t.id === device.tenantId);
              const config = statusConfig[device.status];
              const StatusIcon = config.icon;

              return (
                <TableRow
                  key={device.id}
                  className={cn(
                    'cursor-pointer',
                    device.status === 'error' && 'bg-status-critical-bg',
                    selectedDevice?.id === device.id && 'bg-accent',
                    isSelected(device.id) && 'bg-primary/5'
                  )}
                  onClick={() => !compareMode && setSelectedDevice(device)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected(device.id)}
                      onCheckedChange={() => toggleSelection(device.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/devices/${device.id}`}
                      className="font-mono text-sm font-medium hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {device.deviceCode}
                    </Link>
                  </TableCell>
                  <TableCell>{device.type}</TableCell>
                  <TableCell className="text-sm">{device.model}</TableCell>
                  <TableCell>{site?.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {tenant?.name}
                  </TableCell>
                  <TableCell>
                    <span className={cn('status-badge', config.class)}>
                      <StatusIcon className="h-3 w-3" />
                      {config.label}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    v{device.appVersion}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(device.lastHeartbeat), {
                      addSuffix: true,
                      locale: ja,
                    })}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/devices/${device.id}`}>詳細を表示</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>チケット作成</DropdownMenuItem>
                        <DropdownMenuItem>作業依頼</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Tag className="mr-2 h-4 w-4" />
                          タグ付け
                        </DropdownMenuItem>
                        <DropdownMenuItem>リモート再起動</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {filteredDevices.length > 20 && (
          <div className="border-t p-3 text-center">
            <Button variant="ghost" size="sm">
              さらに表示 ({filteredDevices.length - 20}件)
            </Button>
          </div>
        )}
      </div>

      {/* Device Detail Panel */}
      {selectedDevice && !compareMode && (
        <div className="rounded-lg border bg-card p-6 animate-fade-in">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold">{selectedDevice.deviceCode}</h2>
              <p className="text-muted-foreground">{selectedDevice.model}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/devices/${selectedDevice.id}`}>詳細画面へ</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedDevice(null)}>
                閉じる
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* Basic Info */}
            <div>
              <h3 className="mb-3 font-medium">基本情報</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">種別</dt>
                  <dd>{selectedDevice.type}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">メーカー</dt>
                  <dd>{selectedDevice.manufacturer}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">OS</dt>
                  <dd>{selectedDevice.osVersion}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">アプリ版本</dt>
                  <dd className="font-mono">v{selectedDevice.appVersion}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">設置日</dt>
                  <dd>{selectedDevice.installedDate}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">保証期限</dt>
                  <dd>{selectedDevice.warrantyExpiry}</dd>
                </div>
              </dl>
            </div>

            {/* Modules */}
            <div>
              <h3 className="mb-3 font-medium">搭載モジュール</h3>
              <div className="space-y-2">
                {selectedDevice.modules.map((module) => (
                  <div
                    key={module.id}
                    className={cn(
                      'flex items-center justify-between rounded-lg border p-2',
                      module.status === 'error' && 'border-status-critical bg-status-critical-bg',
                      module.status === 'warning' && 'border-status-warning bg-status-warning-bg'
                    )}
                  >
                    <div>
                      <p className="font-medium">{module.type}</p>
                      <p className="text-xs text-muted-foreground">{module.model}</p>
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
          </div>
        </div>
      )}

      {/* Compare Mode Panel */}
      {compareMode && selectedCount >= 2 && (
        <div className="rounded-lg border bg-card p-6 animate-fade-in">
          <h2 className="text-lg font-semibold mb-4">端末比較 ({selectedCount}台選択中)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4">項目</th>
                  {Array.from(selectedIds).slice(0, 4).map((id) => {
                    const device = devices.find((d) => d.id === id);
                    return (
                      <th key={id} className="text-left py-2 px-4 min-w-[150px]">
                        {device?.deviceCode}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {['type', 'model', 'status', 'appVersion', 'osVersion'].map((field) => (
                  <tr key={field} className="border-b">
                    <td className="py-2 pr-4 text-muted-foreground capitalize">{field}</td>
                    {Array.from(selectedIds).slice(0, 4).map((id) => {
                      const device = devices.find((d) => d.id === id);
                      return (
                        <td key={id} className="py-2 px-4">
                          {device?.[field as keyof Device] as string}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedCount}
        onClearSelection={clearSelection}
        onAction={handleBulkAction}
        entityType="device"
      />

      {/* Export Dialog */}
      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        entityType="端末"
        totalCount={filteredDevices.length}
        selectedCount={selectedCount}
        columns={exportColumns}
      />
    </div>
  );
}
