import { useState, useEffect } from 'react';
import { Activity, RefreshCw, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

interface RealTimeIndicatorProps {
  lastUpdated: Date;
  isLive?: boolean;
  onRefresh?: () => void;
  onToggleLive?: (live: boolean) => void;
}

export function RealTimeIndicator({
  lastUpdated,
  isLive = true,
  onRefresh,
  onToggleLive,
}: RealTimeIndicatorProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="relative">
          <Activity className={cn('h-4 w-4', isLive && 'text-status-healthy')} />
          {isLive && (
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-status-healthy animate-pulse" />
          )}
        </div>
        <span>
          最終更新:{' '}
          {formatDistanceToNow(lastUpdated, { addSuffix: true, locale: ja })}
        </span>
      </div>

      {onToggleLive && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2"
          onClick={() => onToggleLive(!isLive)}
        >
          {isLive ? (
            <>
              <Pause className="h-3 w-3" />
              停止
            </>
          ) : (
            <>
              <Play className="h-3 w-3" />
              ライブ
            </>
          )}
        </Button>
      )}

      {onRefresh && (
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

// Auto-refresh hook
export function useAutoRefresh(
  callback: () => void,
  intervalMs: number = 30000,
  enabled: boolean = true
) {
  const [isLive, setIsLive] = useState(enabled);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      callback();
      setLastUpdated(new Date());
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isLive, intervalMs, callback]);

  const refresh = () => {
    callback();
    setLastUpdated(new Date());
  };

  return {
    isLive,
    setIsLive,
    lastUpdated,
    refresh,
  };
}
