import { useState } from 'react';
import {
  CheckSquare,
  Upload,
  Tag,
  Trash2,
  Download,
  RefreshCw,
  Power,
  X,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface BulkActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  onAction: (action: string) => void;
  entityType: 'device' | 'ticket' | 'alert';
}

interface ActionConfig {
  id: string;
  label: string;
  icon: typeof CheckSquare;
  variant: 'default' | 'outline';
  dangerous?: boolean;
}

const actionConfigs: Record<string, ActionConfig[]> = {
  device: [
    { id: 'update', label: 'ソフト更新', icon: Upload, variant: 'default' },
    { id: 'tag', label: 'タグ付け', icon: Tag, variant: 'outline' },
    { id: 'restart', label: 'リモート再起動', icon: RefreshCw, variant: 'outline', dangerous: true },
    { id: 'export', label: 'CSV出力', icon: Download, variant: 'outline' },
  ],
  ticket: [
    { id: 'assign', label: '担当者割当', icon: CheckSquare, variant: 'default' },
    { id: 'priority', label: '優先度変更', icon: AlertTriangle, variant: 'outline' },
    { id: 'close', label: 'クローズ', icon: X, variant: 'outline' },
    { id: 'export', label: 'CSV出力', icon: Download, variant: 'outline' },
  ],
  alert: [
    { id: 'acknowledge', label: '確認済みにする', icon: CheckSquare, variant: 'default' },
    { id: 'assign', label: '担当者割当', icon: Tag, variant: 'outline' },
    { id: 'resolve', label: '解決済みにする', icon: X, variant: 'outline' },
    { id: 'ticket', label: 'チケット作成', icon: Upload, variant: 'outline' },
  ],
};

export function BulkActions({ selectedCount, onClearSelection, onAction, entityType }: BulkActionsProps) {
  const [confirmDialog, setConfirmDialog] = useState<string | null>(null);
  const actions = actionConfigs[entityType];

  if (selectedCount === 0) return null;

  const handleAction = (actionId: string, dangerous?: boolean) => {
    if (dangerous) {
      setConfirmDialog(actionId);
    } else {
      onAction(actionId);
    }
  };

  const confirmAction = () => {
    if (confirmDialog) {
      onAction(confirmDialog);
      setConfirmDialog(null);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
        <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 shadow-lg">
          <div className="flex items-center gap-2 border-r pr-3">
            <CheckSquare className="h-4 w-4 text-primary" />
            <span className="font-mono-num font-semibold">{selectedCount}</span>
            <span className="text-sm text-muted-foreground">件選択中</span>
          </div>
          
          <div className="flex items-center gap-2">
            {actions.slice(0, 3).map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant={action.variant}
                  size="sm"
                  className="gap-2"
                  onClick={() => handleAction(action.id, action.dangerous)}
                >
                  <Icon className="h-4 w-4" />
                  {action.label}
                </Button>
              );
            })}
            
            {actions.length > 3 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    その他
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {actions.slice(3).map((action) => {
                    const Icon = action.icon;
                    return (
                      <DropdownMenuItem
                        key={action.id}
                        onClick={() => handleAction(action.id, action.dangerous)}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {action.label}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            onClick={onClearSelection}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AlertDialog open={!!confirmDialog} onOpenChange={() => setConfirmDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>操作の確認</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedCount}件の項目に対してこの操作を実行しますか？
              この操作は取り消せない場合があります。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>実行</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Selection state hook
export function useSelection<T extends { id: string }>() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = (items: T[]) => {
    setSelectedIds(new Set(items.map((item) => item.id)));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const isSelected = (id: string) => selectedIds.has(id);

  return {
    selectedIds,
    selectedCount: selectedIds.size,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
  };
}
