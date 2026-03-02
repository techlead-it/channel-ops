import { useParams, Link } from 'react-router-dom';
import {
  Upload,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  RotateCcw,
  Play,
  Pause,
  Target,
  Monitor,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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

// Mock deployment results
const deploymentResults = [
  { deviceId: 'd1', deviceCode: 'TDB-1-001', status: 'success', completedAt: '2024-01-15 10:30' },
  { deviceId: 'd2', deviceCode: 'TDB-1-002', status: 'success', completedAt: '2024-01-15 10:32' },
  { deviceId: 'd3', deviceCode: 'TDB-1-003', status: 'failed', error: 'Connection timeout', completedAt: null },
  { deviceId: 'd4', deviceCode: 'TDB-2-001', status: 'success', completedAt: '2024-01-15 10:35' },
  { deviceId: 'd5', deviceCode: 'TDB-2-002', status: 'pending', completedAt: null },
  { deviceId: 'd6', deviceCode: 'TDB-2-003', status: 'downloading', progress: 45, completedAt: null },
];

export default function ReleaseDetail() {
  const { id } = useParams<{ id: string }>();
  const release = releases.find((r) => r.id === id) || releases[0];

  if (!release) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">リリースが見つかりません</h2>
          <Link to="/releases">
            <Button className="mt-4">リリース一覧に戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

  const config = statusConfig[release.status];
  const StatusIcon = config.icon;
  const targetDevices = devices.filter((d) => release.targetDeviceTypes.includes(d.type));
  const deployedCount = Math.floor(targetDevices.length * (release.rolloutPercentage / 100));

  const successCount = deploymentResults.filter((r) => r.status === 'success').length;
  const failedCount = deploymentResults.filter((r) => r.status === 'failed').length;
  const pendingCount = deploymentResults.filter((r) => ['pending', 'downloading'].includes(r.status)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link to="/releases">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-2xl font-bold">v{release.version}</span>
              <span className={cn('status-badge', config.class)}>
                <StatusIcon className="h-3 w-3" />
                {config.label}
              </span>
            </div>
            <h1 className="mt-2 text-xl font-semibold">{release.name}</h1>
            <p className="mt-1 text-muted-foreground">{release.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {release.status === 'deploying' && (
            <>
              <Button variant="outline" className="gap-2">
                <Pause className="h-4 w-4" />
                一時停止
              </Button>
              <Button variant="outline" className="gap-2 text-destructive">
                <RotateCcw className="h-4 w-4" />
                ロールバック
              </Button>
              <Button className="gap-2">
                <Target className="h-4 w-4" />
                次の段階へ
              </Button>
            </>
          )}
          {release.status === 'approved' && (
            <Button className="gap-2">
              <Play className="h-4 w-4" />
              配信開始
            </Button>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 text-center lg:col-span-2">
          <p className="text-sm text-muted-foreground">配信進捗</p>
          <p className="font-mono-num text-4xl font-bold text-primary">{release.rolloutPercentage}%</p>
          <Progress value={release.rolloutPercentage} className="mt-4 h-3" />
          <p className="mt-2 text-sm text-muted-foreground">
            {deployedCount} / {targetDevices.length} 台
          </p>
        </div>
        <div className="rounded-lg border bg-status-healthy-bg p-4 text-center">
          <CheckCircle className="mx-auto h-6 w-6 text-status-healthy" />
          <p className="mt-2 font-mono-num text-2xl font-bold">{successCount}</p>
          <p className="text-sm text-muted-foreground">成功</p>
        </div>
        <div className="rounded-lg border bg-status-critical-bg p-4 text-center">
          <XCircle className="mx-auto h-6 w-6 text-status-critical" />
          <p className="mt-2 font-mono-num text-2xl font-bold">{failedCount}</p>
          <p className="text-sm text-muted-foreground">失敗</p>
        </div>
      </div>

      {/* Rollout Stages */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold">段階ロールアウト</h2>
        <div className="mt-4 flex items-center gap-2">
          {[
            { percentage: 1, label: 'カナリア' },
            { percentage: 10, label: '初期' },
            { percentage: 50, label: '中間' },
            { percentage: 100, label: '完了' },
          ].map((stage, index) => {
            const isActive = release.rolloutPercentage >= stage.percentage;
            const isCurrent =
              release.rolloutPercentage >= stage.percentage &&
              (index === 3 || release.rolloutPercentage < [1, 10, 50, 100][index + 1]);

            return (
              <div key={stage.percentage} className="flex items-center">
                <div
                  className={cn(
                    'flex flex-col items-center justify-center rounded-lg border p-3 text-center transition-all',
                    isActive && 'bg-primary/10 border-primary',
                    isCurrent && 'ring-2 ring-primary ring-offset-2'
                  )}
                >
                  <span className="font-mono text-lg font-bold">{stage.percentage}%</span>
                  <span className="text-xs text-muted-foreground">{stage.label}</span>
                </div>
                {index < 3 && (
                  <div
                    className={cn(
                      'mx-2 h-1 w-12 rounded',
                      isActive ? 'bg-primary' : 'bg-border'
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Deployment Results */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">配信結果</h2>
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                更新
              </Button>
            </div>
            <div className="mt-4 divide-y rounded-lg border">
              {deploymentResults.map((result) => (
                <div
                  key={result.deviceId}
                  className={cn(
                    'flex items-center justify-between p-3',
                    result.status === 'failed' && 'bg-status-critical-bg'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Monitor className="h-5 w-5 text-muted-foreground" />
                    <span className="font-mono">{result.deviceCode}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {result.status === 'downloading' && (
                      <div className="flex items-center gap-2">
                        <Progress value={result.progress} className="h-2 w-20" />
                        <span className="text-sm">{result.progress}%</span>
                      </div>
                    )}
                    <span
                      className={cn(
                        'status-badge',
                        result.status === 'success' && 'status-healthy',
                        result.status === 'failed' && 'status-critical',
                        result.status === 'pending' && 'status-offline',
                        result.status === 'downloading' && 'status-info'
                      )}
                    >
                      {result.status === 'success' && '成功'}
                      {result.status === 'failed' && '失敗'}
                      {result.status === 'pending' && '待機中'}
                      {result.status === 'downloading' && 'ダウンロード中'}
                    </span>
                    {result.status === 'failed' && (
                      <Button variant="outline" size="sm">
                        再試行
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Failed Devices */}
          {failedCount > 0 && (
            <div className="rounded-lg border border-status-critical bg-status-critical-bg p-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-status-critical" />
                <h2 className="text-lg font-semibold">失敗した端末</h2>
              </div>
              <div className="mt-4 space-y-2">
                {deploymentResults
                  .filter((r) => r.status === 'failed')
                  .map((result) => (
                    <div key={result.deviceId} className="rounded-lg bg-card p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono">{result.deviceCode}</span>
                        <Button variant="outline" size="sm">
                          再試行
                        </Button>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        エラー: {result.error}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Release Info */}
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold">リリース情報</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">バージョン</dt>
                <dd className="font-mono">v{release.version}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">作成日</dt>
                <dd>{format(new Date(release.createdAt), 'yyyy/MM/dd', { locale: ja })}</dd>
              </div>
              {release.approvedBy && (
                <>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">承認者</dt>
                    <dd>{release.approvedBy}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">承認日</dt>
                    <dd>{format(new Date(release.approvedAt!), 'yyyy/MM/dd', { locale: ja })}</dd>
                  </div>
                </>
              )}
            </dl>
          </div>

          {/* Target Devices */}
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold">対象端末</h3>
            <div className="mt-4 space-y-2">
              {release.targetDeviceTypes.map((type) => (
                <div
                  key={type}
                  className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
                >
                  <span>{type}</span>
                  <span className="font-mono text-sm">
                    {devices.filter((d) => d.type === type).length}台
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Offline Devices */}
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold">オフライン端末</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              オフラインの端末は接続時に自動で配信されます。
            </p>
            <div className="mt-4 rounded-lg bg-muted/50 p-3 text-center">
              <p className="font-mono-num text-xl font-bold">3</p>
              <p className="text-xs text-muted-foreground">台が待機中</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
