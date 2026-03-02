import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, File, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: string;
  totalCount: number;
  selectedCount?: number;
  columns: { id: string; label: string; default?: boolean }[];
}

export function ExportDialog({
  open,
  onOpenChange,
  entityType,
  totalCount,
  selectedCount = 0,
  columns,
}: ExportDialogProps) {
  const [format, setFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [scope, setScope] = useState<'all' | 'selected' | 'filtered'>('filtered');
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(
    new Set(columns.filter((c) => c.default !== false).map((c) => c.id))
  );
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleColumnToggle = (columnId: string) => {
    const newSelected = new Set(selectedColumns);
    if (newSelected.has(columnId)) {
      newSelected.delete(columnId);
    } else {
      newSelected.add(columnId);
    }
    setSelectedColumns(newSelected);
  };

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsExporting(false);
    setExported(true);
    setTimeout(() => {
      setExported(false);
      onOpenChange(false);
    }, 1500);
  };

  const formatOptions = [
    { id: 'csv', label: 'CSV', icon: FileText, description: 'カンマ区切りテキスト' },
    { id: 'excel', label: 'Excel', icon: FileSpreadsheet, description: 'XLSX形式' },
    { id: 'pdf', label: 'PDF', icon: File, description: 'レポート形式' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            {entityType}をエクスポート
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div className="space-y-2">
            <Label>形式</Label>
            <div className="grid grid-cols-3 gap-2">
              {formatOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => setFormat(option.id as typeof format)}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors',
                      format === option.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    )}
                  >
                    <Icon className={cn('h-6 w-6', format === option.id && 'text-primary')} />
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scope Selection */}
          <div className="space-y-2">
            <Label>対象</Label>
            <RadioGroup value={scope} onValueChange={(v) => setScope(v as typeof scope)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="filtered" id="filtered" />
                <Label htmlFor="filtered" className="font-normal">
                  現在のフィルタ結果 ({totalCount}件)
                </Label>
              </div>
              {selectedCount > 0 && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="selected" id="selected" />
                  <Label htmlFor="selected" className="font-normal">
                    選択した項目のみ ({selectedCount}件)
                  </Label>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="font-normal">
                  すべて
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Column Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>出力カラム</Label>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => {
                  if (selectedColumns.size === columns.length) {
                    setSelectedColumns(new Set());
                  } else {
                    setSelectedColumns(new Set(columns.map((c) => c.id)));
                  }
                }}
              >
                {selectedColumns.size === columns.length ? 'すべて解除' : 'すべて選択'}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-auto p-1">
              {columns.map((column) => (
                <div key={column.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={column.id}
                    checked={selectedColumns.has(column.id)}
                    onCheckedChange={() => handleColumnToggle(column.id)}
                  />
                  <Label htmlFor={column.id} className="text-sm font-normal">
                    {column.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || selectedColumns.size === 0}
            className="gap-2"
          >
            {exported ? (
              <>
                <Check className="h-4 w-4" />
                完了
              </>
            ) : isExporting ? (
              <>
                <Download className="h-4 w-4 animate-bounce" />
                エクスポート中...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                エクスポート
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
