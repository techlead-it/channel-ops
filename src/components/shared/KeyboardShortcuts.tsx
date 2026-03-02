import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface KeyboardShortcutsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const shortcuts = [
  { category: 'ナビゲーション', items: [
    { keys: ['⌘', 'K'], description: 'クイックアクション' },
    { keys: ['⌘', 'D'], description: '端末台帳' },
    { keys: ['⌘', 'A'], description: 'アラート' },
    { keys: ['⌘', 'T'], description: 'チケット' },
    { keys: ['G', 'H'], description: 'ダッシュボード' },
  ]},
  { category: '操作', items: [
    { keys: ['⌘', 'S'], description: '保存' },
    { keys: ['⌘', 'Enter'], description: '送信/確定' },
    { keys: ['Esc'], description: 'キャンセル/閉じる' },
    { keys: ['?'], description: 'ショートカット一覧' },
  ]},
  { category: '一覧画面', items: [
    { keys: ['J'], description: '次の項目' },
    { keys: ['K'], description: '前の項目' },
    { keys: ['Enter'], description: '詳細を開く' },
    { keys: ['F'], description: 'フィルター' },
  ]},
];

export function KeyboardShortcuts({ open, onOpenChange }: KeyboardShortcutsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>キーボードショートカット</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {shortcuts.map((group) => (
            <div key={group.category}>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {group.category}
              </h3>
              <div className="space-y-2">
                {group.items.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-1"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <span key={keyIndex}>
                          <kbd className="px-2 py-1 text-xs font-semibold bg-muted rounded border">
                            {key}
                          </kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="mx-0.5 text-muted-foreground">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook to enable global keyboard shortcuts
export function useKeyboardShortcuts(
  onQuickAction: () => void,
  onShortcutHelp: () => void
) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // ⌘/Ctrl + K: Quick action
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onQuickAction();
        return;
      }

      // ?: Show shortcuts
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        onShortcutHelp();
        return;
      }

      // Navigation shortcuts (without modifier)
      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        switch (e.key) {
          case 'g':
            // Wait for next key
            const handleNextKey = (nextEvent: KeyboardEvent) => {
              if (nextEvent.key === 'h') {
                navigate('/');
              } else if (nextEvent.key === 'd') {
                navigate('/devices');
              } else if (nextEvent.key === 'a') {
                navigate('/alerts');
              } else if (nextEvent.key === 't') {
                navigate('/tickets');
              }
              window.removeEventListener('keydown', handleNextKey);
            };
            window.addEventListener('keydown', handleNextKey, { once: true });
            break;
        }
      }

      // ⌘/Ctrl + shortcuts
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'd':
            e.preventDefault();
            navigate('/devices');
            break;
          case 'a':
            e.preventDefault();
            navigate('/alerts');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, onQuickAction, onShortcutHelp]);
}
