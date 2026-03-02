import { Link } from 'react-router-dom';
import { Bell, AlertTriangle, Ticket, Upload, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/contexts/AuthContext';

const typeConfig: Record<string, { icon: typeof Bell; class: string; bg: string }> = {
  alert: { icon: AlertTriangle, class: 'text-status-critical', bg: 'bg-status-critical-bg' },
  ticket: { icon: Ticket, class: 'text-status-warning', bg: 'bg-status-warning-bg' },
  release: { icon: Upload, class: 'text-status-info', bg: 'bg-status-info-bg' },
  work_order: { icon: Wrench, class: 'text-primary', bg: 'bg-primary/10' },
  system: { icon: Bell, class: 'text-muted-foreground', bg: 'bg-muted' },
};

export default function Notifications() {
  const { user } = useAuth();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <Bell className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground/50" />
        <h2 className="mt-4 text-lg md:text-xl font-semibold text-center">ログインが必要です</h2>
        <p className="mt-2 text-sm md:text-base text-muted-foreground text-center">通知を表示するにはログインしてください</p>
        <Button className="mt-4" asChild>
          <Link to="/auth">ログイン</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">通知</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount}件の未読通知` : 'すべて既読です'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead} className="self-start sm:self-auto">
            すべて既読にする
          </Button>
        )}
      </div>

      {/* Notification List */}
      <div className="rounded-lg border bg-card">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="mx-auto h-10 w-10 md:h-12 md:w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">通知はありません</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => {
              const config = typeConfig[notification.type] || typeConfig.system;
              const Icon = config.icon;

              return (
                <div
                  key={notification.id}
                  className={cn(
                    'flex items-start gap-3 p-3 md:p-4 transition-colors',
                    !notification.is_read && 'bg-primary/5'
                  )}
                >
                  <div className={cn('rounded-full p-1.5 md:p-2 shrink-0', config.bg)}>
                    <Icon className={cn('h-4 w-4 md:h-5 md:w-5', config.class)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className={cn('text-sm md:text-base font-medium truncate', !notification.is_read && 'font-semibold')}>
                          {notification.title}
                        </p>
                        <p className="mt-0.5 text-xs md:text-sm text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <div className="h-2 w-2 shrink-0 rounded-full bg-primary mt-1.5" />
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 md:gap-4">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                          locale: ja,
                        })}
                      </span>
                      {notification.link && (
                        <Link
                          to={notification.link}
                          className="text-xs text-primary hover:underline"
                        >
                          詳細を見る
                        </Link>
                      )}
                      {!notification.is_read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          既読にする
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
