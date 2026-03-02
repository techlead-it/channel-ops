import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function KPICard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  trendValue,
  variant = 'default',
  className,
}: KPICardProps) {
  const variantClasses = {
    default: 'kpi-card',
    primary: 'kpi-card kpi-card-primary',
    success: 'kpi-card kpi-card-success',
    warning: 'kpi-card kpi-card-warning',
    danger: 'kpi-card kpi-card-danger',
  };

  const iconColorClasses = {
    default: 'text-muted-foreground',
    primary: 'text-primary',
    success: 'text-status-healthy',
    warning: 'text-status-warning',
    danger: 'text-status-critical',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColorClass = trend === 'up' ? 'text-status-healthy' : trend === 'down' ? 'text-status-critical' : 'text-muted-foreground';

  return (
    <div className={cn(variantClasses[variant], className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-mono-num text-3xl font-bold tracking-tight">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          {trend && trendValue && (
            <div className={cn('mt-2 flex items-center gap-1 text-xs', trendColorClass)}>
              <TrendIcon className="h-3 w-3" />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={cn('rounded-lg p-2', iconColorClasses[variant])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
