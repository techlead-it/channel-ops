import { useState } from 'react';
import { Bookmark, Plus, X, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export interface SavedView {
  id: string;
  name: string;
  filters: Record<string, string>;
  isDefault?: boolean;
  createdAt: Date;
}

// Demo saved views
const defaultViews: SavedView[] = [
  {
    id: 'v1',
    name: '障害端末のみ',
    filters: { status: 'error' },
    createdAt: new Date(),
  },
  {
    id: 'v2',
    name: '金融機関A - 全端末',
    filters: { tenant: 't1' },
    createdAt: new Date(),
  },
  {
    id: 'v3',
    name: '今日の緊急チケット',
    filters: { priority: 'urgent', status: 'open' },
    createdAt: new Date(),
  },
];

interface SavedViewsProps {
  currentFilters: Record<string, string>;
  onApplyView: (filters: Record<string, string>) => void;
  entityType: string;
}

export function SavedViews({ currentFilters, onApplyView, entityType }: SavedViewsProps) {
  const [views, setViews] = useState<SavedView[]>(defaultViews);
  const [activeView, setActiveView] = useState<string | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [newViewName, setNewViewName] = useState('');

  const handleApplyView = (view: SavedView) => {
    setActiveView(view.id);
    onApplyView(view.filters);
  };

  const handleSaveView = () => {
    if (!newViewName.trim()) return;

    const newView: SavedView = {
      id: `v${Date.now()}`,
      name: newViewName,
      filters: currentFilters,
      createdAt: new Date(),
    };

    setViews([...views, newView]);
    setNewViewName('');
    setSaveDialogOpen(false);
    setActiveView(newView.id);
  };

  const handleDeleteView = (id: string) => {
    setViews(views.filter((v) => v.id !== id));
    if (activeView === id) {
      setActiveView(null);
    }
  };

  const hasFilters = Object.keys(currentFilters).some(
    (key) => currentFilters[key] && currentFilters[key] !== 'すべて'
  );

  return (
    <>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Bookmark className={cn('h-4 w-4', activeView && 'fill-current text-primary')} />
              {activeView ? views.find((v) => v.id === activeView)?.name : '保存ビュー'}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {views.length === 0 ? (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                保存されたビューがありません
              </div>
            ) : (
              views.map((view) => (
                <DropdownMenuItem
                  key={view.id}
                  className="group flex items-center justify-between"
                  onClick={() => handleApplyView(view)}
                >
                  <span className={cn(activeView === view.id && 'font-medium')}>
                    {view.name}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                    {activeView === view.id && <Check className="h-3 w-3 text-primary" />}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteView(view.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSaveDialogOpen(true)} disabled={!hasFilters}>
              <Plus className="mr-2 h-4 w-4" />
              現在のフィルタを保存
            </DropdownMenuItem>
            {activeView && (
              <DropdownMenuItem
                onClick={() => {
                  setActiveView(null);
                  onApplyView({});
                }}
              >
                <X className="mr-2 h-4 w-4" />
                ビューを解除
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>ビューを保存</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">ビュー名</label>
              <Input
                placeholder="例: 金融機関A - 障害端末"
                value={newViewName}
                onChange={(e) => setNewViewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveView()}
              />
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">保存されるフィルタ:</p>
              <div className="space-y-1">
                {Object.entries(currentFilters)
                  .filter(([_, value]) => value && value !== 'すべて')
                  .map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="text-muted-foreground">{key}:</span>{' '}
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleSaveView} disabled={!newViewName.trim()}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
