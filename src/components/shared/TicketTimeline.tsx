import {
  Circle,
  AlertTriangle,
  User,
  Clock,
  MessageSquare,
  CheckCircle,
  Wrench,
  Mail,
  FileText,
} from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface TimelineEvent {
  id: string;
  type: 'created' | 'assigned' | 'comment' | 'status_change' | 'escalation' | 'customer_contact' | 'work_order' | 'resolved';
  title: string;
  description?: string;
  user: string;
  timestamp: Date;
  metadata?: Record<string, string>;
}

interface TicketTimelineProps {
  events: TimelineEvent[];
}

const eventConfig = {
  created: { icon: Circle, color: 'text-primary', bg: 'bg-primary/10' },
  assigned: { icon: User, color: 'text-status-info', bg: 'bg-status-info-bg' },
  comment: { icon: MessageSquare, color: 'text-muted-foreground', bg: 'bg-muted' },
  status_change: { icon: Clock, color: 'text-status-warning', bg: 'bg-status-warning-bg' },
  escalation: { icon: AlertTriangle, color: 'text-status-critical', bg: 'bg-status-critical-bg' },
  customer_contact: { icon: Mail, color: 'text-primary', bg: 'bg-primary/10' },
  work_order: { icon: Wrench, color: 'text-status-info', bg: 'bg-status-info-bg' },
  resolved: { icon: CheckCircle, color: 'text-status-healthy', bg: 'bg-status-healthy-bg' },
};

// Demo events
const demoEvents: TimelineEvent[] = [
  {
    id: 'e1',
    type: 'created',
    title: 'チケット作成',
    description: 'アラートから自動作成されました',
    user: 'システム',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: 'e2',
    type: 'assigned',
    title: '担当者割当',
    description: '田中 花子 に割り当てられました',
    user: '山田 太郎',
    timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
  },
  {
    id: 'e3',
    type: 'comment',
    title: 'コメント追加',
    description: 'リモートログを確認したところ、紙幣ユニットのセンサーエラーを検出。現地確認が必要です。',
    user: '田中 花子',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: 'e4',
    type: 'customer_contact',
    title: '顧客連絡',
    description: '初回連絡メールを送信しました',
    user: '田中 花子',
    timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
  },
  {
    id: 'e5',
    type: 'work_order',
    title: '作業依頼作成',
    description: '現地対応作業（WO-2024-00123）を作成しました',
    user: '田中 花子',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'e6',
    type: 'status_change',
    title: 'ステータス変更',
    description: 'オープン → 対応中',
    user: '佐藤 次郎',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
];

export function TicketTimeline({ events = demoEvents }: TicketTimelineProps) {
  return (
    <div className="space-y-0">
      {events.map((event, index) => {
        const config = eventConfig[event.type];
        const Icon = config.icon;
        const isLast = index === events.length - 1;

        return (
          <div key={event.id} className="relative flex gap-4 pb-6">
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-[15px] top-8 h-[calc(100%-16px)] w-px bg-border" />
            )}

            {/* Icon */}
            <div
              className={cn(
                'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                config.bg
              )}
            >
              <Icon className={cn('h-4 w-4', config.color)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm">{event.title}</p>
                  {event.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {event.description}
                    </p>
                  )}
                </div>
                <time className="text-xs text-muted-foreground shrink-0 ml-2">
                  {format(event.timestamp, 'MM/dd HH:mm', { locale: ja })}
                </time>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                by {event.user}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
