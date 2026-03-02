import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Wrench,
  ArrowLeft,
  Clock,
  User,
  MapPin,
  Monitor,
  CheckCircle,
  Circle,
  Camera,
  Package,
  FileText,
  Send,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { devices, sites, tenants } from '@/data/demoData';
import { cn } from '@/lib/utils';

interface WorkOrder {
  id: string;
  orderNumber: string;
  type: string;
  status: string;
  priority: string;
  deviceId: string;
  siteId: string;
  tenantId: string;
  assignee: string;
  scheduledDate: string;
  scheduledTime: string;
  description: string;
  checklist: { item: string; completed: boolean }[];
}

const mockOrder: WorkOrder = {
  id: 'wo1',
  orderNumber: 'WO-2024-0001',
  type: '障害対応',
  status: 'in_progress',
  priority: 'high',
  deviceId: 'd1',
  siteId: 's1',
  tenantId: 't1',
  assignee: '山田 太郎',
  scheduledDate: '2024-01-15',
  scheduledTime: '10:00',
  description: '紙幣ジャム対応',
  checklist: [
    { item: '現場到着確認', completed: true },
    { item: '端末ステータス確認', completed: true },
    { item: '障害原因特定', completed: false },
    { item: '復旧作業実施', completed: false },
    { item: '動作確認テスト', completed: false },
  ],
};

export default function WorkOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [checklist, setChecklist] = useState(mockOrder.checklist);
  const [notes, setNotes] = useState('');
  const [parts, setParts] = useState<{ name: string; serial: string }[]>([]);

  const device = devices.find((d) => d.id === mockOrder.deviceId);
  const site = sites.find((s) => s.id === mockOrder.siteId);
  const tenant = tenants.find((t) => t.id === mockOrder.tenantId);

  const toggleChecklistItem = (index: number) => {
    const newChecklist = [...checklist];
    newChecklist[index].completed = !newChecklist[index].completed;
    setChecklist(newChecklist);
  };

  const completedCount = checklist.filter((c) => c.completed).length;
  const progress = (completedCount / checklist.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link to="/work-orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg font-semibold">{mockOrder.orderNumber}</span>
              <span className="rounded bg-status-critical-bg px-2 py-0.5 text-xs font-medium text-status-critical">
                {mockOrder.type}
              </span>
              <span className="status-badge status-warning">
                <Clock className="h-3 w-3" />
                作業中
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold">{mockOrder.description}</h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {mockOrder.assignee}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {mockOrder.scheduledDate} {mockOrder.scheduledTime}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            報告書出力
          </Button>
          <Button className="gap-2">
            <CheckCircle className="h-4 w-4" />
            作業完了
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Progress */}
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">作業進捗</h2>
              <span className="font-mono text-lg font-bold">{completedCount}/{checklist.length}</span>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Checklist */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold">チェックリスト</h2>
            <div className="mt-4 space-y-3">
              {checklist.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border p-3 transition-colors',
                    item.completed && 'bg-status-healthy-bg border-status-healthy'
                  )}
                >
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => toggleChecklistItem(index)}
                  />
                  <span className={cn(item.completed && 'line-through text-muted-foreground')}>
                    {item.item}
                  </span>
                  {item.completed && (
                    <CheckCircle className="ml-auto h-4 w-4 text-status-healthy" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Parts */}
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">交換部品</h2>
              <Button variant="outline" size="sm" className="gap-2">
                <Package className="h-4 w-4" />
                部品追加
              </Button>
            </div>
            {parts.length === 0 ? (
              <p className="mt-4 text-center text-sm text-muted-foreground">
                交換部品はありません
              </p>
            ) : (
              <div className="mt-4 space-y-2">
                {parts.map((part, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                    <span>{part.name}</span>
                    <span className="font-mono text-sm">{part.serial}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Photos */}
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">写真</h2>
              <Button variant="outline" size="sm" className="gap-2">
                <Camera className="h-4 w-4" />
                写真追加
              </Button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
                <Camera className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold">作業メモ</h2>
            <Textarea
              className="mt-4"
              placeholder="作業内容、気づいた点などを記録..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Device Info */}
          {device && (
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold">対象端末</h3>
              <Link
                to={`/devices/${device.id}`}
                className="mt-4 block rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-muted-foreground" />
                  <span className="font-mono font-medium">{device.deviceCode}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{device.model}</p>
              </Link>
            </div>
          )}

          {/* Location */}
          {site && (
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold">拠点情報</h3>
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{site.name}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{site.address}</p>
                <p className="mt-1 text-sm text-muted-foreground">{tenant?.name}</p>
              </div>
            </div>
          )}

          {/* Report Template */}
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold">作業報告書</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              作業完了後、報告書を自動生成できます。署名欄付きPDFで出力されます。
            </p>
            <Button className="mt-4 w-full gap-2">
              <FileText className="h-4 w-4" />
              報告書プレビュー
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold">クイック操作</h3>
            <div className="mt-4 space-y-2">
              <Button variant="outline" className="w-full">担当者に連絡</Button>
              <Button variant="outline" className="w-full">チケット作成</Button>
              <Button variant="outline" className="w-full">作業キャンセル</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
