import { releases } from '@/data/demoData';
import { Upload, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const statusConfig = {
  draft: { label: '下書き', icon: Clock, class: 'text-muted-foreground' },
  testing: { label: 'テスト中', icon: Clock, class: 'text-status-info' },
  approved: { label: '承認済み', icon: CheckCircle, class: 'text-status-healthy' },
  deploying: { label: '配信中', icon: Upload, class: 'text-status-warning' },
  completed: { label: '完了', icon: CheckCircle, class: 'text-status-healthy' },
  rollback: { label: 'ロールバック', icon: AlertCircle, class: 'text-status-critical' },
};

export function ReleaseProgress() {
  const activeReleases = releases.filter((r) => ['deploying', 'testing', 'approved'].includes(r.status));
  const completedReleases = releases.filter((r) => r.status === 'completed').slice(0, 3);

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="mb-4 font-semibold">ソフト配信状況</h3>
      
      {activeReleases.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            配信中
          </p>
          <div className="space-y-3">
            {activeReleases.map((release) => {
              const config = statusConfig[release.status];
              const StatusIcon = config.icon;

              return (
                <div
                  key={release.id}
                  className="rounded-lg border bg-background p-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold">v{release.version}</span>
                        <span className={cn('flex items-center gap-1 text-xs', config.class)}>
                          <StatusIcon className="h-3 w-3" />
                          {config.label}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">{release.name}</p>
                    </div>
                    <span className="font-mono-num text-lg font-bold text-primary">
                      {release.rolloutPercentage}%
                    </span>
                  </div>
                  <div className="mt-3">
                    <Progress value={release.rolloutPercentage} className="h-2" />
                    <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                      <span>段階ロールアウト</span>
                      <span>{release.targetDeviceTypes.join(', ')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {completedReleases.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            最近完了
          </p>
          <div className="space-y-2">
            {completedReleases.map((release) => (
              <div
                key={release.id}
                className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-status-healthy" />
                  <span className="font-mono text-sm">v{release.version}</span>
                  <span className="text-sm text-muted-foreground">{release.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">100%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
