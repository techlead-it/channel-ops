import { useParams, Link } from 'react-router-dom';
import {
  Ticket,
  ArrowLeft,
  Clock,
  User,
  Monitor,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Paperclip,
  Send,
  Calendar,
  Mail,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { tickets, devices, sites, tenants } from '@/data/demoData';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow, differenceInHours } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState } from 'react';
import { SLACountdown, SLAProgress } from '@/components/shared/SLACountdown';
import { TicketTimeline } from '@/components/shared/TicketTimeline';
import { CustomerEmailTemplate } from '@/components/shared/CustomerEmailTemplate';
import { SimilarIncidents } from '@/components/shared/SimilarIncidents';

const priorityConfig = {
  urgent: { label: '緊急', class: 'status-critical' },
  high: { label: '高', class: 'status-warning' },
  medium: { label: '中', class: 'status-info' },
  low: { label: '低', class: 'status-offline' },
};

const statusConfig = {
  open: { label: 'オープン', class: 'status-info' },
  in_progress: { label: '対応中', class: 'status-warning' },
  pending: { label: '保留', class: 'status-offline' },
  resolved: { label: '解決済み', class: 'status-healthy' },
  closed: { label: 'クローズ', class: 'status-offline' },
};

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const ticket = tickets.find((t) => t.id === id || t.ticketNumber === id);
  const [comment, setComment] = useState('');
  const [emailTemplateOpen, setEmailTemplateOpen] = useState(false);

  if (!ticket) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Ticket className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">チケットが見つかりません</h2>
          <Link to="/tickets">
            <Button className="mt-4">チケット一覧に戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

  const device = devices.find((d) => d.id === ticket.deviceId);
  const site = sites.find((s) => s.id === ticket.siteId);
  const tenant = tenants.find((t) => t.id === ticket.tenantId);
  const priority = priorityConfig[ticket.priority];
  const status = statusConfig[ticket.status];

  const getSlaStatus = () => {
    if (['resolved', 'closed'].includes(ticket.status)) return 'met';
    const hoursRemaining = differenceInHours(new Date(ticket.slaDeadline), new Date());
    if (hoursRemaining < 0) return 'breached';
    if (hoursRemaining < 4) return 'warning';
    return 'ok';
  };

  const slaStatus = getSlaStatus();

  // Mock comments
  const comments = [
    {
      id: 1,
      user: '田中 花子',
      time: '2024-01-15 10:30',
      content: '現地確認を手配しました。保守員が14:00頃到着予定です。',
    },
    {
      id: 2,
      user: '山田 太郎',
      time: '2024-01-15 14:15',
      content: '現地到着しました。紙幣ユニットの点検を開始します。',
    },
    {
      id: 3,
      user: '山田 太郎',
      time: '2024-01-15 15:00',
      content: '紙幣ジャムを解消しました。テスト運用中です。',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link to="/tickets">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg font-semibold">{ticket.ticketNumber}</span>
              <span className={cn('status-badge', priority.class)}>
                <AlertTriangle className="h-3 w-3" />
                {priority.label}
              </span>
              <span className={cn('status-badge', status.class)}>
                {status.label}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold">{ticket.title}</h1>
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="rounded bg-muted px-2 py-0.5">{ticket.type}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                作成: {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true, locale: ja })}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setEmailTemplateOpen(true)}>
            <Mail className="h-4 w-4" />
            顧客連絡
          </Button>
          {ticket.status === 'open' && (
            <Button variant="outline">対応開始</Button>
          )}
          {ticket.status === 'in_progress' && (
            <Button className="gap-2">
              <CheckCircle className="h-4 w-4" />
              解決済みにする
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Description */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold">説明</h2>
            <p className="mt-4 text-muted-foreground">{ticket.description}</p>
          </div>

          {/* Tabs for Comments and Timeline */}
          <div className="rounded-lg border bg-card p-6">
            <Tabs defaultValue="comments">
              <TabsList>
                <TabsTrigger value="comments" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  コメント
                </TabsTrigger>
                <TabsTrigger value="timeline" className="gap-2">
                  <Clock className="h-4 w-4" />
                  タイムライン
                </TabsTrigger>
                <TabsTrigger value="knowledge" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  ナレッジ
                </TabsTrigger>
              </TabsList>

              <TabsContent value="comments" className="mt-4">
                <div className="space-y-4">
                  {comments.map((c) => (
                    <div key={c.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                            {c.user.charAt(0)}
                          </div>
                          <span className="font-medium">{c.user}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{c.time}</span>
                      </div>
                      <p className="mt-3 text-sm">{c.content}</p>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="mt-6">
                  <Textarea
                    placeholder="コメントを追加..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                  />
                  <div className="mt-2 flex justify-between">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Paperclip className="h-4 w-4" />
                      ファイル添付
                    </Button>
                    <Button size="sm" className="gap-2">
                      <Send className="h-4 w-4" />
                      送信
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="mt-4">
                <TicketTimeline events={[]} />
              </TabsContent>

              <TabsContent value="knowledge" className="mt-4">
                <SimilarIncidents
                  currentAlertTitle={ticket.title}
                  deviceType={device?.type || ''}
                  alertType="hardware"
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* SLA Countdown */}
          <div
            className={cn(
              'rounded-lg border p-4',
              slaStatus === 'breached' && 'border-status-critical bg-status-critical-bg',
              slaStatus === 'warning' && 'border-status-warning bg-status-warning-bg'
            )}
          >
            <h3 className="font-semibold mb-4">SLA</h3>
            <SLACountdown
              deadline={new Date(ticket.slaDeadline)}
              status={ticket.status}
              showDetails
            />
            <div className="mt-4">
              <SLAProgress
                createdAt={new Date(ticket.createdAt)}
                deadline={new Date(ticket.slaDeadline)}
                status={ticket.status}
              />
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">期限</span>
                <span className="font-medium">
                  {format(new Date(ticket.slaDeadline), 'yyyy/MM/dd HH:mm', { locale: ja })}
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold">詳細</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">担当者</dt>
                <dd className="flex items-center gap-1">
                  {ticket.assignee ? (
                    <>
                      <User className="h-4 w-4" />
                      {ticket.assignee}
                    </>
                  ) : (
                    <span className="text-muted-foreground">未割当</span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">顧客</dt>
                <dd>{tenant?.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">拠点</dt>
                <dd>{site?.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">作成日</dt>
                <dd>{format(new Date(ticket.createdAt), 'yyyy/MM/dd HH:mm', { locale: ja })}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">更新日</dt>
                <dd>{format(new Date(ticket.updatedAt), 'yyyy/MM/dd HH:mm', { locale: ja })}</dd>
              </div>
            </dl>
          </div>

          {/* Related Device */}
          {device && (
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold">関連端末</h3>
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

          {/* Actions */}
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold">操作</h3>
            <div className="mt-4 space-y-2">
              <Button variant="outline" className="w-full">担当者変更</Button>
              <Button variant="outline" className="w-full">優先度変更</Button>
              <Button variant="outline" className="w-full">作業依頼作成</Button>
              <Button variant="outline" className="w-full">ナレッジ化</Button>
              <Button variant="outline" className="w-full text-destructive">チケット削除</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Email Template */}
      <CustomerEmailTemplate
        open={emailTemplateOpen}
        onOpenChange={setEmailTemplateOpen}
        ticketNumber={ticket.ticketNumber}
        ticketTitle={ticket.title}
        siteName={site?.name || ''}
        status={status.label}
      />
    </div>
  );
}
