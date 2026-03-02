import { useState } from 'react';
import { Copy, Check, Mail, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface CustomerEmailTemplateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticketNumber: string;
  ticketTitle: string;
  siteName: string;
  status: string;
  estimatedResolution?: Date;
}

const templates = {
  initial: (data: { ticketNumber: string; ticketTitle: string; siteName: string }) => `
件名: 【ご連絡】${data.ticketTitle}について（${data.ticketNumber}）

お客様

平素より大変お世話になっております。
HCSサポートセンターでございます。

${data.siteName}にて発生しております下記の件について、
現在対応を進めております。

■ チケット番号: ${data.ticketNumber}
■ 件名: ${data.ticketTitle}
■ ステータス: 対応中

現地確認および復旧作業を実施中です。
進捗がございましたら、改めてご連絡いたします。

ご不便をおかけしており、誠に申し訳ございません。
何卒よろしくお願いいたします。

---
HCSサポートセンター
TEL: 03-XXXX-XXXX
Email: support@hcs.co.jp
`.trim(),

  progress: (data: { ticketNumber: string; ticketTitle: string; status: string }) => `
件名: 【進捗報告】${data.ticketTitle}について（${data.ticketNumber}）

お客様

平素より大変お世話になっております。
HCSサポートセンターでございます。

下記の件について、進捗をご報告いたします。

■ チケット番号: ${data.ticketNumber}
■ 件名: ${data.ticketTitle}
■ 現在のステータス: ${data.status}

【対応状況】
・原因の特定が完了しました
・復旧作業を実施中です
・本日中の復旧を見込んでおります

引き続き、復旧に向けて対応を進めてまいります。
何卒よろしくお願いいたします。

---
HCSサポートセンター
`.trim(),

  resolution: (data: { ticketNumber: string; ticketTitle: string }) => `
件名: 【復旧完了】${data.ticketTitle}について（${data.ticketNumber}）

お客様

平素より大変お世話になっております。
HCSサポートセンターでございます。

下記の件について、復旧が完了いたしましたのでご報告いたします。

■ チケット番号: ${data.ticketNumber}
■ 件名: ${data.ticketTitle}
■ ステータス: 復旧完了

【対応内容】
・原因: XXXの不具合
・対処: 部品交換およびソフトウェア更新を実施
・再発防止: 定期点検スケジュールを見直し

この度はご不便をおかけし、誠に申し訳ございませんでした。
今後ともよろしくお願いいたします。

---
HCSサポートセンター
`.trim(),
};

export function CustomerEmailTemplate({
  open,
  onOpenChange,
  ticketNumber,
  ticketTitle,
  siteName,
  status,
}: CustomerEmailTemplateProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<'initial' | 'progress' | 'resolution'>('initial');
  const [emailContent, setEmailContent] = useState('');
  const [copied, setCopied] = useState(false);

  const generateEmail = () => {
    const template = templates[selectedTemplate];
    const content = template({ ticketNumber, ticketTitle, siteName, status });
    setEmailContent(content);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(emailContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate on open or template change
  useState(() => {
    generateEmail();
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            顧客連絡テンプレート
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Template Selection */}
          <div className="flex gap-2">
            <Button
              variant={selectedTemplate === 'initial' ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setSelectedTemplate('initial'); generateEmail(); }}
            >
              初回連絡
            </Button>
            <Button
              variant={selectedTemplate === 'progress' ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setSelectedTemplate('progress'); generateEmail(); }}
            >
              進捗報告
            </Button>
            <Button
              variant={selectedTemplate === 'resolution' ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setSelectedTemplate('resolution'); generateEmail(); }}
            >
              復旧完了
            </Button>
          </div>

          {/* Email Content */}
          <div className="flex-1 overflow-auto">
            <Textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              className="min-h-[300px] font-mono text-sm resize-none"
              placeholder="テンプレートを選択してください"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button variant="outline" onClick={generateEmail} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            再生成
          </Button>
          <Button onClick={copyToClipboard} className="gap-2">
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                コピー完了
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                クリップボードにコピー
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
