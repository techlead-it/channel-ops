import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Monitor,
  AlertTriangle,
  Ticket,
  Wrench,
  Upload,
  Link2,
  FileText,
  BarChart3,
  Shield,
  ChevronLeft,
  ChevronRight,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  { title: 'ダッシュボード', icon: LayoutDashboard, path: '/' },
  { title: '端末台帳', icon: Monitor, path: '/devices' },
  { title: '監視・アラート', icon: AlertTriangle, path: '/alerts', badge: 10 },
  { title: 'チケット', icon: Ticket, path: '/tickets', badge: 20 },
  { title: '作業・保守', icon: Wrench, path: '/work-orders' },
  { title: 'ソフト配信', icon: Upload, path: '/releases' },
];

const systemNavItems: NavItem[] = [
  { title: '外部接続', icon: Link2, path: '/connections' },
  { title: '申請テンプレ', icon: FileText, path: '/templates' },
  { title: 'レポート', icon: BarChart3, path: '/reports' },
  { title: '権限・監査', icon: Shield, path: '/admin' },
];

interface AppSidebarProps {
  onNavigate?: () => void;
}

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const handleNavClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <aside
      className={cn(
        'flex h-full flex-col bg-sidebar text-sidebar-foreground transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-sidebar-foreground">ChannelOps</h1>
              <p className="text-xs text-sidebar-foreground/60">Core Platform</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary mx-auto">
            <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        <div className="px-3">
          {!collapsed && (
            <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
              運用管理
            </p>
          )}
          <ul className="space-y-1">
            {mainNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    cn(
                      'nav-item',
                      isActive ? 'nav-item-active' : 'nav-item-inactive',
                      collapsed && 'justify-center px-2'
                    )
                  }
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-status-critical px-1.5 text-xs font-medium text-white">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 px-3">
          {!collapsed && (
            <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
              システム
            </p>
          )}
          <ul className="space-y-1">
            {systemNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    cn(
                      'nav-item',
                      isActive ? 'nav-item-active' : 'nav-item-inactive',
                      collapsed && 'justify-center px-2'
                    )
                  }
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span className="flex-1">{item.title}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Collapse Toggle - Only on desktop */}
      {!onNavigate && (
        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center rounded-md py-2 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>
      )}
    </aside>
  );
}
