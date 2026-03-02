import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  Clock,
  User,
  MapPin,
  CheckCircle,
  Circle,
  AlertTriangle,
  FileText,
  Camera,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { devices, sites, tenants } from '@/data/demoData';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface WorkOrder {
  id: string;
  orderNumber: string;
  type: '定期保守' | '障害対応' | '設置' | '撤去' | '部品交換';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  deviceId: string;
  siteId: string;
  tenantId: string;
  assignee: string;
  scheduledDate: string;
  scheduledTime: string;
  description: string;
  checklist: { item: string; completed: boolean }[];
}

// Mock work orders
const workOrders: WorkOrder[] = [
  {
    id: 'wo1',
    orderNumber: 'WO-2024-0001',
    type: '障害対応',
    status: 'in_progress',
    priority: 'high',
    deviceId: 'd1',
    siteId: 's1',
    tenantId: 't1',
    assignee: '山田 太郎',
    scheduledDate: format(new Date(), 'yyyy-MM-dd'),
    scheduledTime: '10:00',
    description: '紙幣ジャム対応',
    checklist: [
      { item: '現場到着確認', completed: true },
      { item: '端末ステータス確認', completed: true },
      { item: '障害原因特定', completed: false },
      { item: '復旧作業実施', completed: false },
      { item: '動作確認テスト', completed: false },
    ],
  },
  {
    id: 'wo2',
    orderNumber: 'WO-2024-0002',
    type: '定期保守',
    status: 'scheduled',
    priority: 'medium',
    deviceId: 'd5',
    siteId: 's2',
    tenantId: 't1',
    assignee: '佐藤 次郎',
    scheduledDate: format(new Date(), 'yyyy-MM-dd'),
    scheduledTime: '14:00',
    description: '月次定期保守作業',
    checklist: [
      { item: '外観点検', completed: false },
      { item: '清掃作業', completed: false },
      { item: '動作確認', completed: false },
      { item: '消耗品交換', completed: false },
    ],
  },
  {
    id: 'wo3',
    orderNumber: 'WO-2024-0003',
    type: '部品交換',
    status: 'scheduled',
    priority: 'medium',
    deviceId: 'd10',
    siteId: 's4',
    tenantId: 't2',
    assignee: '田中 花子',
    scheduledDate: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'),
    scheduledTime: '09:00',
    description: 'カードリーダー交換',
    checklist: [
      { item: '旧部品取り外し', completed: false },
      { item: '新部品取り付け', completed: false },
      { item: '動作確認テスト', completed: false },
      { item: '台帳更新', completed: false },
    ],
  },
];

const statusConfig = {
  scheduled: { label: '予定', class: 'status-info', icon: Calendar },
  in_progress: { label: '作業中', class: 'status-warning', icon: Clock },
  completed: { label: '完了', class: 'status-healthy', icon: CheckCircle },
  cancelled: { label: 'キャンセル', class: 'status-offline', icon: Circle },
};

const priorityConfig = {
  high: { label: '高', class: 'status-critical' },
  medium: { label: '中', class: 'status-warning' },
  low: { label: '低', class: 'status-offline' },
};

const typeConfig = {
  定期保守: 'bg-status-info-bg text-status-info',
  障害対応: 'bg-status-critical-bg text-status-critical',
  設置: 'bg-status-healthy-bg text-status-healthy',
  撤去: 'bg-muted text-muted-foreground',
  部品交換: 'bg-status-warning-bg text-status-warning',
};

export default function WorkOrderList() {
  const [statusFilter, setStatusFilter] = useState<string>('すべて');
  const [searchQuery, setSearchQuery] = useState('');

  const todayOrders = workOrders.filter(
    (wo) => wo.scheduledDate === format(new Date(), 'yyyy-MM-dd')
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">作業・保守</h1>
          <p className="mt-1 text-muted-foreground">
            本日の作業: {todayOrders.length}件
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            作業報告書出力
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            作業依頼作成
          </Button>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="rounded-lg border bg-gradient-to-r from-primary/5 to-primary/10 p-4">
        <h2 className="font-semibold">本日の作業予定</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {todayOrders.map((order) => {
            const device = devices.find((d) => d.id === order.deviceId);
            const site = sites.find((s) => s.id === order.siteId);
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;
            const completedItems = order.checklist.filter((c) => c.completed).length;

            return (
              <Link
                key={order.id}
                to={`/work-orders/${order.id}`}
                className="rounded-lg border bg-card p-4 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className={cn('rounded px-2 py-0.5 text-xs font-medium', typeConfig[order.type])}>
                      {order.type}
                    </span>
                    <p className="mt-2 font-mono text-sm">{order.orderNumber}</p>
                  </div>
                  <span className={cn('status-badge', status.class)}>
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </span>
                </div>
                <p className="mt-2 font-medium">{order.description}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {order.scheduledTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {site?.name}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs">
                    <User className="h-3 w-3" />
                    {order.assignee}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    チェック: {completedItems}/{order.checklist.length}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="作業番号、端末ID、担当者で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-enterprise w-full pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              ステータス: {statusFilter}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {['すべて', 'scheduled', 'in_progress', 'completed', 'cancelled'].map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => setStatusFilter(status)}
              >
                {status === 'すべて' ? status : statusConfig[status as keyof typeof statusConfig].label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* All Work Orders */}
      <div className="rounded-lg border bg-card">
        <div className="divide-y">
          {workOrders.map((order) => {
            const device = devices.find((d) => d.id === order.deviceId);
            const site = sites.find((s) => s.id === order.siteId);
            const tenant = tenants.find((t) => t.id === order.tenantId);
            const status = statusConfig[order.status];
            const priority = priorityConfig[order.priority];
            const StatusIcon = status.icon;

            return (
              <Link
                key={order.id}
                to={`/work-orders/${order.id}`}
                className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium">{order.orderNumber}</span>
                      <span className={cn('rounded px-2 py-0.5 text-xs font-medium', typeConfig[order.type])}>
                        {order.type}
                      </span>
                      <span className={cn('status-badge', priority.class)}>
                        {priority.label}
                      </span>
                    </div>
                    <p className="mt-1 font-medium">{order.description}</p>
                    <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{device?.deviceCode}</span>
                      <span>{site?.name}</span>
                      <span>{tenant?.name}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm">{order.scheduledDate}</p>
                    <p className="text-sm text-muted-foreground">{order.scheduledTime}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{order.assignee}</p>
                  </div>
                  <span className={cn('status-badge', status.class)}>
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
