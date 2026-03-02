import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload,
  Plus,
  Search,
  Filter,
  ChevronDown,
  CheckCircle,
  Clock,
  AlertTriangle,
  RotateCcw,
  Play,
  Pause,
  Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { releases, devices } from '@/data/demoData';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

const statusConfig = {
  draft: { label: '下書き', icon: Clock, class: 'status-offline' },
  testing: { label: 'テスト中', icon: Clock, class: 'status-info' },
  approved: { label: '承認済み', icon: CheckCircle, class: 'status-healthy' },
  deploying: { label: '配信中', icon: Upload, class: 'status-warning' },
  completed: { label: '完了', icon: CheckCircle, class: 'status-healthy' },
  rollback: { label: 'ロールバック', icon: RotateCcw, class: 'status-critical' },
};

// Extended releases for demo
const allReleases = [
  ...releases,
  {
    id: 'r3',
    version: '3.4.0',
    name: '新機能リリース',
    description: 'QRコード決済対応、多言語UI追加',
    targetDeviceTypes: ['ATM', 'キオスク'],
    status: 'completed' as const,
    rolloutPercentage: 100,
    createdAt: '2023-11-01T09:00:00Z',
    approvedBy: '鈴木 一郎',
    approvedAt: '2023-11-05T10:00:00Z',
  },
  {
    id: 'r4',
    version: '3.6.0',
    name: 'パフォーマンス改善',
    description: '起動時間短縮、メモリ使用量削減',
    targetDeviceTypes: ['ATM', 'キオスク', '窓口端末', '精算機'],
    status: 'testing' as const,
    rolloutPercentage: 0,
    createdAt: '2024-01-20T09:00:00Z',
  },
];

export default function ReleaseList() {
  const [statusFilter, setStatusFilter] = useState<string>('すべて');
  const [searchQuery, setSearchQuery] = useState('');

  const activeReleases = allReleases.filter((r) => ['deploying', 'testing'].includes(r.status));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">ソフト配信・リリース管理</h1>
          <p className="mt-1 text-muted-foreground">
            遠隔で配信・運用してTCO削減
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          新規リリース
        </Button>
      </div>

      {/* Value Proposition */}
      <div className="rounded-lg border bg-gradient-to-r from-primary/5 to-primary/10 p-4">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-2">
            <Upload className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">段階ロールアウトで安全に配信</p>
            <p className="mt-1 text-sm text-muted-foreground">
              1% → 10% → 50% → 100% と段階的に配信。問題発生時は即座にロールバック可能。
              オフライン端末も追跡し、接続時に自動配信。
            </p>
          </div>
        </div>
      </div>

      {/* Active Deployments */}
      {activeReleases.length > 0 && (
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold">進行中の配信</h2>
          <div className="mt-4 space-y-4">
            {activeReleases.map((release) => {
              const config = statusConfig[release.status];
              const StatusIcon = config.icon;
              const targetCount = devices.filter((d) =>
                release.targetDeviceTypes.includes(d.type)
              ).length;
              const deployedCount = Math.floor(targetCount * (release.rolloutPercentage / 100));

              return (
                <Link
                  key={release.id}
                  to={`/releases/${release.id}`}
                  className="block rounded-lg border p-4 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-lg font-semibold">v{release.version}</span>
                        <span className={cn('status-badge', config.class)}>
                          <StatusIcon className="h-3 w-3" />
                          {config.label}
                        </span>
                      </div>
                      <p className="mt-1 font-medium">{release.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{release.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono-num text-3xl font-bold text-primary">
                        {release.rolloutPercentage}%
                      </span>
                      <p className="text-sm text-muted-foreground">
                        {deployedCount} / {targetCount} 台
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress value={release.rolloutPercentage} className="h-3" />
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>対象: {release.targetDeviceTypes.join(', ')}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-6 gap-1">
                          <Pause className="h-3 w-3" />
                          一時停止
                        </Button>
                        <Button variant="outline" size="sm" className="h-6 gap-1">
                          <Target className="h-3 w-3" />
                          次の段階へ
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Rollout Stages */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold">段階ロールアウト設定</h2>
        <div className="mt-4 flex items-center gap-2">
          {[1, 10, 50, 100].map((percentage, index) => (
            <div key={percentage} className="flex items-center">
              <div
                className={cn(
                  'flex h-12 w-16 items-center justify-center rounded-lg border text-center',
                  index === 0 && 'bg-primary/10 border-primary'
                )}
              >
                <span className="font-mono font-semibold">{percentage}%</span>
              </div>
              {index < 3 && (
                <div className="mx-2 h-px w-8 bg-border" />
              )}
            </div>
          ))}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          各段階で問題がなければ次の段階へ進行。異常検知時は自動停止。
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="バージョン、名前で検索..."
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
            {['すべて', 'draft', 'testing', 'approved', 'deploying', 'completed', 'rollback'].map((status) => (
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

      {/* All Releases */}
      <div className="rounded-lg border bg-card">
        <div className="divide-y">
          {allReleases.map((release) => {
            const config = statusConfig[release.status];
            const StatusIcon = config.icon;

            return (
              <Link
                key={release.id}
                to={`/releases/${release.id}`}
                className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <span className="font-mono font-bold text-primary">v{release.version.split('.')[0]}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">v{release.version}</span>
                      <span className={cn('status-badge', config.class)}>
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </span>
                    </div>
                    <p className="font-medium">{release.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {release.targetDeviceTypes.join(', ')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono-num text-lg font-semibold">{release.rolloutPercentage}%</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(release.createdAt), 'yyyy/MM/dd', { locale: ja })}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
