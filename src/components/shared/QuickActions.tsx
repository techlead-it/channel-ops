import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import {
  Monitor,
  AlertTriangle,
  Ticket,
  Upload,
  Link2,
  FileText,
  Settings,
  User,
  Search,
  Plus,
  BarChart3,
  Bell,
} from 'lucide-react';

interface QuickActionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickActions({ open, onOpenChange }: QuickActionsProps) {
  const navigate = useNavigate();

  const handleSelect = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          <CommandInput placeholder="コマンドを検索... (Ctrl+K)" />
          <CommandList>
            <CommandEmpty>結果がありません</CommandEmpty>
            
            <CommandGroup heading="クイックアクション">
              <CommandItem onSelect={() => handleSelect('/tickets')}>
                <Plus className="mr-2 h-4 w-4" />
                新規チケット作成
                <CommandShortcut>⌘T</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect('/alerts')}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                アラート確認
                <CommandShortcut>⌘A</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect('/devices')}>
                <Search className="mr-2 h-4 w-4" />
                端末検索
                <CommandShortcut>⌘D</CommandShortcut>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />
            
            <CommandGroup heading="ナビゲーション">
              <CommandItem onSelect={() => handleSelect('/')}>
                <BarChart3 className="mr-2 h-4 w-4" />
                ダッシュボード
              </CommandItem>
              <CommandItem onSelect={() => handleSelect('/devices')}>
                <Monitor className="mr-2 h-4 w-4" />
                端末台帳
              </CommandItem>
              <CommandItem onSelect={() => handleSelect('/alerts')}>
                <Bell className="mr-2 h-4 w-4" />
                監視・アラート
              </CommandItem>
              <CommandItem onSelect={() => handleSelect('/tickets')}>
                <Ticket className="mr-2 h-4 w-4" />
                チケット
              </CommandItem>
              <CommandItem onSelect={() => handleSelect('/releases')}>
                <Upload className="mr-2 h-4 w-4" />
                リリース管理
              </CommandItem>
              <CommandItem onSelect={() => handleSelect('/connections')}>
                <Link2 className="mr-2 h-4 w-4" />
                外部接続
              </CommandItem>
              <CommandItem onSelect={() => handleSelect('/templates')}>
                <FileText className="mr-2 h-4 w-4" />
                テンプレート
              </CommandItem>
              <CommandItem onSelect={() => handleSelect('/reports')}>
                <BarChart3 className="mr-2 h-4 w-4" />
                レポート
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />
            
            <CommandGroup heading="設定">
              <CommandItem onSelect={() => handleSelect('/profile')}>
                <User className="mr-2 h-4 w-4" />
                プロフィール
              </CommandItem>
              <CommandItem onSelect={() => handleSelect('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                設定
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
