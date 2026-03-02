import { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  User,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EscalationLevel {
  level: number;
  name: string;
  triggerMinutes: number;
  notifyUsers: string[];
  actions: string[];
}

interface EscalationRulesProps {
  alertSeverity: 'critical' | 'high' | 'medium' | 'low';
  currentMinutesSinceCreation: number;
}

const escalationConfig: Record<string, EscalationLevel[]> = {
  critical: [
    {
      level: 1,
      name: '初期対応',
      triggerMinutes: 0,
      notifyUsers: ['監視オペレータ', 'チームリーダー'],
      actions: ['Slack通知', 'SMS送信', '画面アラート'],
    },
    {
      level: 2,
      name: 'エスカレーション1',
      triggerMinutes: 15,
      notifyUsers: ['シニアエンジニア', 'オンコール担当'],
      actions: ['電話連絡', 'インシデント管理者通知'],
    },
    {
      level: 3,
      name: 'エスカレーション2',
      triggerMinutes: 30,
      notifyUsers: ['マネージャー', '顧客担当'],
      actions: ['経営層報告', '顧客連絡開始'],
    },
    {
      level: 4,
      name: '重大インシデント',
      triggerMinutes: 60,
      notifyUsers: ['ディレクター', 'VPオペレーション'],
      actions: ['戦略会議招集', 'メディア対応準備'],
    },
  ],
  high: [
    {
      level: 1,
      name: '初期対応',
      triggerMinutes: 0,
      notifyUsers: ['監視オペレータ'],
      actions: ['Slack通知', '画面アラート'],
    },
    {
      level: 2,
      name: 'エスカレーション1',
      triggerMinutes: 30,
      notifyUsers: ['チームリーダー'],
      actions: ['Slack通知', 'メール送信'],
    },
    {
      level: 3,
      name: 'エスカレーション2',
      triggerMinutes: 120,
      notifyUsers: ['マネージャー'],
      actions: ['電話連絡'],
    },
  ],
  medium: [
    {
      level: 1,
      name: '初期対応',
      triggerMinutes: 0,
      notifyUsers: ['監視オペレータ'],
      actions: ['画面アラート'],
    },
    {
      level: 2,
      name: 'エスカレーション',
      triggerMinutes: 240,
      notifyUsers: ['チームリーダー'],
      actions: ['Slack通知'],
    },
  ],
  low: [
    {
      level: 1,
      name: '通常対応',
      triggerMinutes: 0,
      notifyUsers: ['監視オペレータ'],
      actions: ['画面表示'],
    },
  ],
};

export function EscalationRules({ alertSeverity, currentMinutesSinceCreation }: EscalationRulesProps) {
  const [expanded, setExpanded] = useState(false);
  const levels = escalationConfig[alertSeverity] || escalationConfig.low;

  // Find current level
  const currentLevel = levels.reduce((current, level) => {
    if (currentMinutesSinceCreation >= level.triggerMinutes) {
      return level.level;
    }
    return current;
  }, 1);

  // Find next level
  const nextLevel = levels.find((l) => l.triggerMinutes > currentMinutesSinceCreation);

  return (
    <div className="rounded-lg border bg-card p-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className={cn(
            'h-4 w-4',
            alertSeverity === 'critical' && 'text-status-critical',
            alertSeverity === 'high' && 'text-status-warning',
            alertSeverity === 'medium' && 'text-status-info',
            alertSeverity === 'low' && 'text-muted-foreground'
          )} />
          <h3 className="font-medium">エスカレーションルール</h3>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            現在レベル {currentLevel}
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Next escalation warning */}
      {nextLevel && (
        <div className="mt-3 rounded-lg bg-status-warning-bg p-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-status-warning" />
            <span className="text-sm font-medium">
              次のエスカレーションまで: {nextLevel.triggerMinutes - currentMinutesSinceCreation}分
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            レベル {nextLevel.level}: {nextLevel.name} → {nextLevel.notifyUsers.join(', ')}
          </p>
        </div>
      )}

      {/* Expanded view */}
      {expanded && (
        <div className="mt-4 space-y-3">
          {levels.map((level, index) => {
            const isActive = level.level === currentLevel;
            const isPast = level.level < currentLevel;
            const isFuture = level.level > currentLevel;

            return (
              <div key={level.level} className="relative">
                {/* Connector line */}
                {index < levels.length - 1 && (
                  <div className={cn(
                    'absolute left-4 top-8 h-[calc(100%+12px)] w-px',
                    isPast ? 'bg-primary' : 'bg-border'
                  )} />
                )}

                <div className={cn(
                  'flex gap-4 rounded-lg p-3',
                  isActive && 'bg-primary/5 border border-primary',
                  isPast && 'opacity-60'
                )}>
                  {/* Level indicator */}
                  <div className={cn(
                    'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                    isActive && 'bg-primary text-primary-foreground',
                    isPast && 'bg-primary/50 text-primary-foreground',
                    isFuture && 'bg-muted text-muted-foreground border-2 border-dashed'
                  )}>
                    {level.level}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{level.name}</p>
                      <span className="text-xs text-muted-foreground">
                        (+{level.triggerMinutes}分)
                      </span>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-1">
                      {level.notifyUsers.map((user) => (
                        <span
                          key={user}
                          className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs"
                        >
                          <User className="h-3 w-3" />
                          {user}
                        </span>
                      ))}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {level.actions.map((action) => (
                        <span
                          key={action}
                          className="inline-flex items-center gap-1 rounded bg-status-info-bg px-2 py-0.5 text-xs text-status-info"
                        >
                          <Bell className="h-3 w-3" />
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
