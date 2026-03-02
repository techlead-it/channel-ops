import { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { differenceInSeconds, differenceInMinutes, differenceInHours } from 'date-fns';
import { cn } from '@/lib/utils';

interface SLACountdownProps {
  deadline: Date;
  status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
  showDetails?: boolean;
}

export function SLACountdown({ deadline, status, showDetails = false }: SLACountdownProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (['resolved', 'closed'].includes(status)) return;
    
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  if (['resolved', 'closed'].includes(status)) {
    return (
      <div className="flex items-center gap-2 text-status-healthy">
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm font-medium">SLA達成</span>
      </div>
    );
  }

  const totalSeconds = differenceInSeconds(deadline, now);
  const isBreached = totalSeconds < 0;
  const absSeconds = Math.abs(totalSeconds);
  
  const hours = Math.floor(absSeconds / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const seconds = absSeconds % 60;

  const isWarning = !isBreached && totalSeconds < 4 * 3600; // Less than 4 hours

  const formatTime = () => {
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}日 ${remainingHours}時間`;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2',
        isBreached && 'bg-status-critical-bg text-status-critical',
        isWarning && !isBreached && 'bg-status-warning-bg text-status-warning',
        !isBreached && !isWarning && 'bg-muted text-foreground'
      )}
    >
      {isBreached ? (
        <AlertTriangle className="h-4 w-4 animate-pulse" />
      ) : (
        <Clock className="h-4 w-4" />
      )}
      <div>
        <div className="font-mono-num text-lg font-bold">
          {isBreached && '-'}
          {formatTime()}
        </div>
        {showDetails && (
          <p className="text-xs opacity-80">
            {isBreached ? 'SLA超過' : 'SLA期限まで'}
          </p>
        )}
      </div>
    </div>
  );
}

// Progress bar version
interface SLAProgressProps {
  createdAt: Date;
  deadline: Date;
  status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
}

export function SLAProgress({ createdAt, deadline, status }: SLAProgressProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (['resolved', 'closed'].includes(status)) return;
    
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [status]);

  const totalDuration = differenceInMinutes(deadline, createdAt);
  const elapsed = differenceInMinutes(now, createdAt);
  const percentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  const isBreached = now > deadline;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">SLA進捗</span>
        <span className={cn(
          'font-medium',
          isBreached && 'text-status-critical',
          percentage > 75 && !isBreached && 'text-status-warning'
        )}>
          {isBreached ? 'SLA超過' : `${Math.round(percentage)}%`}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isBreached && 'bg-status-critical',
            percentage > 75 && !isBreached && 'bg-status-warning',
            percentage <= 75 && !isBreached && 'bg-primary'
          )}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
    </div>
  );
}
