import { Clock, Monitor, Ticket, AlertTriangle, Upload, Settings } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export interface ActivityItem {
  id: string;
  type: 'device' | 'ticket' | 'alert' | 'release' | 'setting';
  action: string;
  target: string;
  timestamp: Date;
  user?: string;
}

// Mock recent activities - would come from backend in real app
export const recentActivities: ActivityItem[] = [
  { id: '1', type: 'ticket', action: '作成', target: 'TKT-2024-00021', timestamp: new Date(Date.now() - 300000), user: '山田 太郎' },
  { id: '2', type: 'alert', action: '確認', target: '紙幣ジャム発生', timestamp: new Date(Date.now() - 600000), user: '田中 花子' },
  { id: '3', type: 'device', action: '更新', target: 'TDB-1-001', timestamp: new Date(Date.now() - 900000), user: '佐藤 次郎' },
  { id: '4', type: 'release', action: '承認', target: 'v3.5.0', timestamp: new Date(Date.now() - 1800000), user: '鈴木 一郎' },
  { id: '5', type: 'setting', action: '変更', target: '通知設定', timestamp: new Date(Date.now() - 3600000), user: '高橋 美咲' },
];

const typeConfig = {
  device: { icon: Monitor, class: 'text-primary' },
  ticket: { icon: Ticket, class: 'text-status-info' },
  alert: { icon: AlertTriangle, class: 'text-status-warning' },
  release: { icon: Upload, class: 'text-status-healthy' },
  setting: { icon: Settings, class: 'text-muted-foreground' },
};

interface RecentActivityProps {
  activities?: ActivityItem[];
  maxItems?: number;
}

export function RecentActivity({ activities = recentActivities, maxItems = 5 }: RecentActivityProps) {
  const displayedActivities = activities.slice(0, maxItems);

  return (
    <div className="space-y-3">
      {displayedActivities.map((activity) => {
        const config = typeConfig[activity.type];
        const Icon = config.icon;

        return (
          <div
            key={activity.id}
            className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
          >
            <div className={cn('mt-0.5', config.class)}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium">{activity.user}</span>
                <span className="text-muted-foreground"> が </span>
                <span className="font-medium">{activity.target}</span>
                <span className="text-muted-foreground"> を{activity.action}</span>
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: ja })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
