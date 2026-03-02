import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { AppSidebar } from './AppSidebar';
import { TopBar } from './TopBar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

export function MainLayout() {
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && <AppSidebar />}

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        {isMobile && (
          <header className="flex h-14 items-center justify-between border-b bg-card px-4">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <AppSidebar onNavigate={() => setMobileMenuOpen(false)} />
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">C</span>
              </div>
              <span className="font-semibold">ChannelOps</span>
            </div>
            <div className="w-10" /> {/* Spacer for balance */}
          </header>
        )}

        <TopBar
          selectedTenant={selectedTenant}
          selectedSite={selectedSite}
          onTenantChange={setSelectedTenant}
          onSiteChange={setSelectedSite}
          isMobile={isMobile}
        />
        <main className="flex-1 overflow-auto p-4 md:p-6 scrollbar-thin">
          <Outlet context={{ selectedTenant, selectedSite }} />
        </main>
      </div>
    </div>
  );
}

export function useFilters() {
  return { selectedTenant: null, selectedSite: null };
}
