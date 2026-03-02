import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Plus,
  Search,
  Filter,
  ChevronDown,
  Copy,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface FormTemplate {
  id: string;
  name: string;
  category: '住民票' | '戸籍' | '税証明' | '届出' | 'その他';
  status: 'active' | 'draft' | 'archived';
  requiredDocs: string[];
  ocrFields: number;
  tenantCustomizations: number;
  lastUpdated: string;
}

const templates: FormTemplate[] = [
  {
    id: 'ft1',
    name: '住民票写し交付申請',
    category: '住民票',
    status: 'active',
    requiredDocs: ['本人確認書類', '委任状（代理人の場合）'],
    ocrFields: 8,
    tenantCustomizations: 3,
    lastUpdated: '2024-01-10',
  },
  {
    id: 'ft2',
    name: '印鑑登録証明書交付申請',
    category: '届出',
    status: 'active',
    requiredDocs: ['印鑑登録証', '本人確認書類'],
    ocrFields: 5,
    tenantCustomizations: 2,
    lastUpdated: '2024-01-08',
  },
  {
    id: 'ft3',
    name: '戸籍謄本・抄本交付申請',
    category: '戸籍',
    status: 'active',
    requiredDocs: ['本人確認書類', '戸籍筆頭者との関係を証明する書類'],
    ocrFields: 10,
    tenantCustomizations: 4,
    lastUpdated: '2024-01-05',
  },
  {
    id: 'ft4',
    name: '所得証明書交付申請',
    category: '税証明',
    status: 'active',
    requiredDocs: ['本人確認書類'],
    ocrFields: 6,
    tenantCustomizations: 5,
    lastUpdated: '2024-01-03',
  },
  {
    id: 'ft5',
    name: '転入届',
    category: '届出',
    status: 'draft',
    requiredDocs: ['転出証明書', '本人確認書類', 'マイナンバーカード'],
    ocrFields: 15,
    tenantCustomizations: 0,
    lastUpdated: '2024-01-15',
  },
];

const categoryConfig = {
  住民票: 'bg-blue-100 text-blue-700',
  戸籍: 'bg-purple-100 text-purple-700',
  税証明: 'bg-green-100 text-green-700',
  届出: 'bg-orange-100 text-orange-700',
  その他: 'bg-gray-100 text-gray-700',
};

const statusConfig = {
  active: { label: '有効', class: 'status-healthy' },
  draft: { label: '下書き', class: 'status-warning' },
  archived: { label: 'アーカイブ', class: 'status-offline' },
};

export default function TemplateList() {
  const [categoryFilter, setCategoryFilter] = useState<string>('すべて');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">申請/受付テンプレート</h1>
          <p className="mt-1 text-muted-foreground">
            「書かない窓口」の業務部品化
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          テンプレート作成
        </Button>
      </div>

      {/* Value Proposition */}
      <div className="rounded-lg border bg-gradient-to-r from-primary/5 to-primary/10 p-4">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-2">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">「書かない窓口」思想</p>
            <p className="mt-1 text-sm text-muted-foreground">
              本人確認・OCR・申請書自動生成を標準化。自治体ごとのカスタム差分のみを管理し、
              業務フローを大きく変えずに導入できます。
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-3xl font-bold">{templates.length}</p>
          <p className="text-sm text-muted-foreground">テンプレート数</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-3xl font-bold">{templates.filter((t) => t.status === 'active').length}</p>
          <p className="text-sm text-muted-foreground">有効</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-3xl font-bold">{templates.reduce((sum, t) => sum + t.ocrFields, 0)}</p>
          <p className="text-sm text-muted-foreground">OCR項目</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-3xl font-bold">{templates.reduce((sum, t) => sum + t.tenantCustomizations, 0)}</p>
          <p className="text-sm text-muted-foreground">カスタム差分</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="テンプレート名で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-enterprise w-full pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              カテゴリ: {categoryFilter}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {['すべて', '住民票', '戸籍', '税証明', '届出', 'その他'].map((cat) => (
              <DropdownMenuItem key={cat} onClick={() => setCategoryFilter(cat)}>
                {cat}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Template Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => {
          const status = statusConfig[template.status];

          return (
            <div
              key={template.id}
              className="rounded-lg border bg-card p-4 transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className={cn('rounded px-2 py-0.5 text-xs font-medium', categoryConfig[template.category])}>
                    {template.category}
                  </span>
                  <h3 className="mt-2 font-semibold">{template.name}</h3>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2">
                      <Eye className="h-4 w-4" />
                      プレビュー
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Edit className="h-4 w-4" />
                      編集
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Copy className="h-4 w-4" />
                      複製
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-destructive">
                      <Trash2 className="h-4 w-4" />
                      削除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">ステータス</span>
                  <span className={cn('status-badge', status.class)}>{status.label}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">OCR項目</span>
                  <span>{template.ocrFields}項目</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">カスタム差分</span>
                  <span>{template.tenantCustomizations}件</span>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs text-muted-foreground">必要書類:</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {template.requiredDocs.map((doc, i) => (
                    <span key={i} className="rounded bg-muted px-2 py-0.5 text-xs">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <span className="text-xs text-muted-foreground">
                  更新: {template.lastUpdated}
                </span>
                <Link to={`/templates/${template.id}`}>
                  <Button variant="outline" size="sm">
                    詳細
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
