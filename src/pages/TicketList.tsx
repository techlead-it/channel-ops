import { useState, useMemo } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  Ticket as TicketIcon,
  Search,
  Filter,
  Plus,
  ChevronDown,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  Circle,
  Pause,
  Mail,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
import { tickets, devices, sites, tenants, Ticket } from '@/data/demoData';
import { cn } from '@/lib/utils';
import { formatDistanceToNow, differenceInHours } from 'date-fns';
import { ja } from 'date-fns/locale';
import { BulkActions, useSelection } from '@/components/shared/BulkActions';
import { SavedViews } from '@/components/shared/SavedViews';
import { ExportDialog } from '@/components/shared/ExportDialog';
import { SLACountdown } from '@/components/shared/SLACountdown';
import { CustomerEmailTemplate } from '@/components/shared/CustomerEmailTemplate';

interface LayoutContext {
  selectedTenant: string | null;
  selectedSite: string | null;
}

const priorityConfig = {
  urgent: { label: '緊急', class: 'status-critical', icon: AlertTriangle },
  high: { label: '高', class: 'status-warning', icon: AlertTriangle },
  medium: { label: '中', class: 'status-info', icon: Circle },
  low: { label: '低', class: 'status-offline', icon: Circle },
};

const statusConfig = {
  open: { label: 'オープン', class: 'status-info', icon: Circle },
  in_progress: { label: '対応中', class: 'status-warning', icon: Clock },
  pending: { label: '保留', class: 'status-offline', icon: Pause },
  resolved: { label: '解決済み', class: 'status-healthy', icon: CheckCircle },
  closed: { label: 'クローズ', class: 'status-offline', icon: CheckCircle },
};

const typeLabels = {
  障害: 'bg-status-critical-bg text-status-critical',
  問合せ: 'bg-status-info-bg text-status-info',
  作業依頼: 'bg-status-warning-bg text-status-warning',
  変更要求: 'bg-muted text-muted-foreground',
};

const exportColumns = [
  { id: 'ticketNumber', label: 'チケット番号', default: true },
  { id: 'type', label: '種別', default: true },
  { id: 'priority', label: '優先度', default: true },
  { id: 'title', label: 'タイトル', default: true },
  { id: 'status', label: 'ステータス', default: true },
  { id: 'assignee', label: '担当者', default: true },
  { id: 'slaDeadline', label: 'SLA期限', default: true },
  { id: 'createdAt', label: '作成日時', default: false },
  { id: 'updatedAt', label: '更新日時', default: false },
  { id: 'site', label: '拠点', default: false },
  { id: 'tenant', label: '顧客', default: false },
];

export default function TicketList() {
  const { selectedTenant, selectedSite } = useOutletContext<LayoutContext>();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('すべて');
  const [typeFilter, setTypeFilter] = useState<string>('すべて');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [emailTemplateOpen, setEmailTemplateOpen] = useState(false);
  const [selectedTicketForEmail, setSelectedTicketForEmail] = useState<Ticket | null>(null);

  const {
    selectedIds,
    selectedCount,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
  } = useSelection<Ticket>();

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      if (selectedTenant && ticket.tenantId !== selectedTenant) return false;
      if (selectedSite && ticket.siteId !== selectedSite) return false;
      if (statusFilter !== 'すべて' && ticket.status !== statusFilter) return false;
      if (typeFilter !== 'すべて' && ticket.type !== typeFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          ticket.ticketNumber.toLowerCase().includes(query) ||
          ticket.title.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [selectedTenant, selectedSite, statusFilter, typeFilter, searchQuery]);

  const statusCounts = useMemo(() => {
    return {
      open: tickets.filter((t) => t.status === 'open').length,
      in_progress: tickets.filter((t) => t.status === 'in_progress').length,
      pending: tickets.filter((t) => t.status === 'pending').length,
      resolved: tickets.filter((t) => t.status === 'resolved').length,
      closed: tickets.filter((t) => t.status === 'closed').length,
    };
  }, []);

  const getSlaStatus = (ticket: Ticket) => {
    if (['resolved', 'closed'].includes(ticket.status)) return 'met';
    const hoursRemaining = differenceInHours(new Date(ticket.slaDeadline), new Date());
    if (hoursRemaining < 0) return 'breached';
    if (hoursRemaining < 4) return 'warning';
    return 'ok';
  };

  const handleBulkAction = (action: string) => {
    console.log('Bulk action:', action, 'on', selectedCount, 'tickets');
    clearSelection();
  };

  const handleApplyView = (filters: Record<string, string>) => {
    if (filters.status) setStatusFilter(filters.status);
    if (filters.type) setTypeFilter(filters.type);
  };

  const handleOpenEmailTemplate = (ticket: Ticket) => {
    setSelectedTicketForEmail(ticket);
    setEmailTemplateOpen(true);
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
          <h1 className="text-2xl font-bold">チケット（ITSM）</h1>
          <p className="mt-1 text-muted-foreground">
            {filteredTickets.length}件のチケット
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setExportDialogOpen(true)}>
            <Download className="h-4 w-4" />
            CSV出力
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            新規チケット
          </Button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 border-b">
        {(['すべて', 'open', 'in_progress', 'pending', 'resolved', 'closed'] as const).map(
          (status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                'flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors',
                statusFilter === status
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {status === 'すべて' ? (
                'すべて'
              ) : (
                <>
                  {statusConfig[status].label}
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                    {statusCounts[status]}
                  </span>
                </>
              )}
            </button>
          )
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="チケット番号、タイトルで検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-enterprise w-full pl-9"
          />
        </div>
        <SavedViews
          currentFilters={currentFilters}
          onApplyView={handleApplyView}
          entityType="ticket"
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
            {['すべて', '障害', '問合せ', '作業依頼', '変更要求'].map((type) => (
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
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedCount === filteredTickets.length && filteredTickets.length > 0}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      selectAll(filteredTickets);
                    } else {
                      clearSelection();
                    }
                  }}
                />
              </TableHead>
              <TableHead>チケット番号</TableHead>
              <TableHead>種別</TableHead>
              <TableHead>優先度</TableHead>
              <TableHead className="min-w-[300px]">タイトル</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead>担当者</TableHead>
              <TableHead>SLA</TableHead>
              <TableHead>更新日時</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.slice(0, 30).map((ticket) => {
              const priority = priorityConfig[ticket.priority];
              const status = statusConfig[ticket.status];
              const slaStatus = getSlaStatus(ticket);
              const site = sites.find((s) => s.id === ticket.siteId);
              const tenant = tenants.find((t) => t.id === ticket.tenantId);
              const PriorityIcon = priority.icon;
              const StatusIcon = status.icon;

              return (
                <TableRow
                  key={ticket.id}
                  className={cn(
                    'cursor-pointer',
                    slaStatus === 'breached' && 'bg-status-critical-bg',
                    isSelected(ticket.id) && 'bg-primary/5'
                  )}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected(ticket.id)}
                      onCheckedChange={() => toggleSelection(ticket.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/tickets/${ticket.id}`}
                      className="font-mono text-sm font-medium hover:underline"
                    >
                      {ticket.ticketNumber}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'rounded px-2 py-0.5 text-xs font-medium',
                        typeLabels[ticket.type]
                      )}
                    >
                      {ticket.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={cn('status-badge', priority.class)}>
                      <PriorityIcon className="h-3 w-3" />
                      {priority.label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className="font-medium hover:underline"
                      >
                        {ticket.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {site?.name} • {tenant?.name}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn('status-badge', status.class)}>
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </span>
                  </TableCell>
                  <TableCell>
                    {ticket.assignee ? (
                      <div className="flex items-center gap-1">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          {ticket.assignee.charAt(0)}
                        </div>
                        <span className="text-sm">{ticket.assignee}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">未割当</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <SLACountdown
                      deadline={new Date(ticket.slaDeadline)}
                      status={ticket.status}
                    />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(ticket.updatedAt), {
                      addSuffix: true,
                      locale: ja,
                    })}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <TicketIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/tickets/${ticket.id}`}>詳細を表示</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenEmailTemplate(ticket)}>
                          <Mail className="mr-2 h-4 w-4" />
                          顧客連絡テンプレ
                        </DropdownMenuItem>
                        <DropdownMenuItem>担当者を変更</DropdownMenuItem>
                        <DropdownMenuItem>優先度を変更</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedCount}
        onClearSelection={clearSelection}
        onAction={handleBulkAction}
        entityType="ticket"
      />

      {/* Export Dialog */}
      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        entityType="チケット"
        totalCount={filteredTickets.length}
        selectedCount={selectedCount}
        columns={exportColumns}
      />

      {/* Customer Email Template */}
      {selectedTicketForEmail && (
        <CustomerEmailTemplate
          open={emailTemplateOpen}
          onOpenChange={setEmailTemplateOpen}
          ticketNumber={selectedTicketForEmail.ticketNumber}
          ticketTitle={selectedTicketForEmail.title}
          siteName={sites.find((s) => s.id === selectedTicketForEmail.siteId)?.name || ''}
          status={statusConfig[selectedTicketForEmail.status].label}
        />
      )}
    </div>
  );
}
