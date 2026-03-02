import { useState } from 'react';
import { Search, ChevronDown, Filter, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { tenants, sites } from '@/data/demoData';
import { cn } from '@/lib/utils';
import { QuickActions } from '@/components/shared/QuickActions';
import { KeyboardShortcuts, useKeyboardShortcuts } from '@/components/shared/KeyboardShortcuts';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { UserMenu } from '@/components/shared/UserMenu';

interface TopBarProps {
  selectedTenant: string | null;
  selectedSite: string | null;
  onTenantChange: (tenantId: string | null) => void;
  onSiteChange: (siteId: string | null) => void;
  isMobile?: boolean;
}

export function TopBar({
  selectedTenant,
  selectedSite,
  onTenantChange,
  onSiteChange,
  isMobile = false,
}: TopBarProps) {
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  
  const selectedTenantData = tenants.find(t => t.id === selectedTenant);
  const selectedSiteData = sites.find(s => s.id === selectedSite);
  const filteredSites = selectedTenant
    ? sites.filter(s => s.tenantId === selectedTenant)
    : sites;

  // Enable keyboard shortcuts
  useKeyboardShortcuts(
    () => setQuickActionsOpen(true),
    () => setShortcutsOpen(true)
  );

  if (isMobile) {
    return (
      <>
        <header className="flex flex-col gap-3 border-b bg-card px-4 py-3">
          {/* Filters Row */}
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 justify-between text-xs">
                  <span className="flex items-center gap-1">
                    <Filter className="h-3 w-3" />
                    {selectedTenantData ? selectedTenantData.name : '全顧客'}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>顧客（テナント）</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { onTenantChange(null); onSiteChange(null); }}>
                  全顧客
                </DropdownMenuItem>
                {tenants.map((tenant) => (
                  <DropdownMenuItem
                    key={tenant.id}
                    onClick={() => { onTenantChange(tenant.id); onSiteChange(null); }}
                    className={cn(selectedTenant === tenant.id && 'bg-accent')}
                  >
                    <span className="flex-1">{tenant.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 justify-between text-xs">
                  {selectedSiteData ? selectedSiteData.name : '全拠点'}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>拠点</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onSiteChange(null)}>
                  全拠点
                </DropdownMenuItem>
                {filteredSites.slice(0, 10).map((site) => (
                  <DropdownMenuItem
                    key={site.id}
                    onClick={() => onSiteChange(site.id)}
                    className={cn(selectedSite === site.id && 'bg-accent')}
                  >
                    {site.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Actions Row */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setQuickActionsOpen(true)}
              className="flex flex-1 items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-sm text-muted-foreground"
            >
              <Search className="h-4 w-4" />
              <span>検索...</span>
            </button>
            <div className="flex items-center gap-1 ml-2">
              <NotificationBell />
              <UserMenu />
            </div>
          </div>
        </header>

        <QuickActions open={quickActionsOpen} onOpenChange={setQuickActionsOpen} />
        <KeyboardShortcuts open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
      </>
    );
  }

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b bg-card px-6">
        {/* Left: Filters */}
        <div className="flex items-center gap-4">
          {/* Tenant Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {selectedTenantData ? selectedTenantData.name : '全顧客'}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>顧客（テナント）</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { onTenantChange(null); onSiteChange(null); }}>
                全顧客
              </DropdownMenuItem>
              {tenants.map((tenant) => (
                <DropdownMenuItem
                  key={tenant.id}
                  onClick={() => { onTenantChange(tenant.id); onSiteChange(null); }}
                  className={cn(selectedTenant === tenant.id && 'bg-accent')}
                >
                  <span className="flex-1">{tenant.name}</span>
                  <span className="text-xs text-muted-foreground">{tenant.type}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Site Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {selectedSiteData ? selectedSiteData.name : '全拠点'}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel>拠点</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onSiteChange(null)}>
                全拠点
              </DropdownMenuItem>
              {filteredSites.map((site) => (
                <DropdownMenuItem
                  key={site.id}
                  onClick={() => onSiteChange(site.id)}
                  className={cn(selectedSite === site.id && 'bg-accent')}
                >
                  <span className="flex-1">{site.name}</span>
                  <span className="text-xs text-muted-foreground">{site.region}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center: Search */}
        <div className="flex flex-1 justify-center px-8">
          <button
            onClick={() => setQuickActionsOpen(true)}
            className="relative flex w-full max-w-md items-center gap-2 rounded-lg border bg-muted/50 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
          >
            <Search className="h-4 w-4" />
            <span>コマンドを検索...</span>
            <div className="ml-auto flex items-center gap-1">
              <kbd className="rounded border bg-background px-1.5 py-0.5 text-xs font-medium">
                ⌘
              </kbd>
              <kbd className="rounded border bg-background px-1.5 py-0.5 text-xs font-medium">
                K
              </kbd>
            </div>
          </button>
        </div>

        {/* Right: Notifications & User */}
        <div className="flex items-center gap-2">
          {/* Keyboard shortcuts help */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShortcutsOpen(true)}
            title="キーボードショートカット (?)"
          >
            <Keyboard className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <NotificationBell />

          {/* User Menu */}
          <UserMenu />
        </div>
      </header>

      {/* Quick Actions Modal */}
      <QuickActions open={quickActionsOpen} onOpenChange={setQuickActionsOpen} />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcuts open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </>
  );
}
