import { useParams, Link } from 'react-router-dom';
import {
  FileText,
  ArrowLeft,
  Edit,
  Copy,
  CheckCircle,
  Eye,
  Settings,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export default function TemplateDetail() {
  const { id } = useParams<{ id: string }>();

  const template = {
    id: 'ft1',
    name: '住民票写し交付申請',
    category: '住民票',
    status: 'active',
    requiredDocs: ['本人確認書類', '委任状（代理人の場合）'],
    ocrFields: [
      { name: '氏名', type: 'text', required: true },
      { name: '生年月日', type: 'date', required: true },
      { name: '住所', type: 'address', required: true },
      { name: '電話番号', type: 'phone', required: false },
      { name: '申請理由', type: 'select', required: true },
      { name: '必要通数', type: 'number', required: true },
      { name: '世帯全員/一部', type: 'radio', required: true },
      { name: '本籍記載有無', type: 'checkbox', required: false },
    ],
    verificationFlow: [
      { step: 1, name: '本人確認書類提示', type: 'document' },
      { step: 2, name: 'マイナンバーカード読取', type: 'card' },
      { step: 3, name: '顔認証', type: 'face' },
    ],
    tenantCustomizations: [
      { tenant: '横浜市役所', field: '申請理由', customOptions: ['年金', '相続', 'パスポート', 'その他'] },
      { tenant: '青葉区役所', field: '手数料', customValue: '300円' },
      { tenant: '港北区役所', field: '備考', customNote: '郵送対応可' },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link to="/templates">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
              {template.category}
            </span>
            <h1 className="mt-2 text-2xl font-bold">{template.name}</h1>
            <div className="mt-2 flex items-center gap-3">
              <span className="status-badge status-healthy">
                <CheckCircle className="h-3 w-3" />
                有効
              </span>
              <span className="text-sm text-muted-foreground">
                OCR: {template.ocrFields.length}項目
              </span>
              <span className="text-sm text-muted-foreground">
                カスタム: {template.tenantCustomizations.length}件
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            プレビュー
          </Button>
          <Button variant="outline" className="gap-2">
            <Copy className="h-4 w-4" />
            複製
          </Button>
          <Button className="gap-2">
            <Edit className="h-4 w-4" />
            編集
          </Button>
        </div>
      </div>

      <Tabs defaultValue="ocr">
        <TabsList>
          <TabsTrigger value="ocr">OCR項目マッピング</TabsTrigger>
          <TabsTrigger value="verification">本人確認フロー</TabsTrigger>
          <TabsTrigger value="customizations">カスタム差分</TabsTrigger>
          <TabsTrigger value="documents">必要書類</TabsTrigger>
        </TabsList>

        <TabsContent value="ocr" className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">OCR項目マッピング</h2>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                項目追加
              </Button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              申請書のOCR読取項目を定義します。
            </p>
            <div className="mt-6 space-y-3">
              {template.ocrFields.map((field, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded bg-muted text-sm font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{field.name}</p>
                      <p className="text-sm text-muted-foreground">
                        タイプ: {field.type}
                        {field.required && ' • 必須'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold">本人確認フロー</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              申請者の本人確認手順を定義します。
            </p>
            <div className="mt-6 space-y-4">
              {template.verificationFlow.map((step, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {step.step}
                  </div>
                  <div className="flex-1 rounded-lg border p-3">
                    <p className="font-medium">{step.name}</p>
                    <p className="text-sm text-muted-foreground">
                      認証タイプ: {step.type}
                    </p>
                  </div>
                  {index < template.verificationFlow.length - 1 && (
                    <div className="absolute left-5 h-8 w-px bg-border" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="customizations" className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">自治体カスタム差分</h2>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                差分追加
              </Button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              自治体ごとのカスタマイズ設定を差分管理します。
            </p>
            <div className="mt-6 space-y-4">
              {template.tenantCustomizations.map((custom, index) => (
                <div key={index} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{custom.tenant}</span>
                    <Button variant="ghost" size="sm">
                      編集
                    </Button>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground">対象項目:</span>{' '}
                    <span className="font-medium">{custom.field}</span>
                  </div>
                  <div className="mt-1 text-sm">
                    <span className="text-muted-foreground">カスタム値:</span>{' '}
                    {custom.customOptions && custom.customOptions.join(', ')}
                    {custom.customValue}
                    {custom.customNote}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold">必要書類</h2>
            <div className="mt-6 space-y-3">
              {template.requiredDocs.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span>{doc}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    編集
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
