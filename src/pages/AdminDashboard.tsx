import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Users,
  Key,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Settings,
  Download,
  Search,
  Filter,
  Workflow,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { tenants } from '@/data/demoData';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { WorkflowAutomation } from '@/components/workflow/WorkflowAutomation';
import { supabase } from '@/integrations/supabase/client';

// Mock data
const users = [
  { id: 'u1', name: '管理者', email: 'admin@hcs.co.jp', role: 'システム管理者', status: 'active', lastLogin: '2024-01-15 10:30' },
  { id: 'u2', name: '田中 花子', email: 'tanaka@hcs.co.jp', role: '運用オペレータ', status: 'active', lastLogin: '2024-01-15 09:15' },
  { id: 'u3', name: '山田 太郎', email: 'yamada@hcs.co.jp', role: 'フィールド保守', status: 'active', lastLogin: '2024-01-15 08:00' },
  { id: 'u4', name: '佐藤 次郎', email: 'sato@hcs.co.jp', role: 'フィールド保守', status: 'active', lastLogin: '2024-01-14 17:30' },
  { id: 'u5', name: '鈴木 一郎', email: 'suzuki@hcs.co.jp', role: 'リリース管理者', status: 'active', lastLogin: '2024-01-15 11:00' },
];

const roles = [
  { id: 'r1', name: 'システム管理者', description: '全機能へのフルアクセス', userCount: 2, permissions: ['all'] },
  { id: 'r2', name: '運用オペレータ', description: '監視・アラート・チケット管理', userCount: 5, permissions: ['alerts', 'tickets', 'devices:read'] },
  { id: 'r3', name: 'フィールド保守', description: '作業・保守のみ', userCount: 10, permissions: ['work-orders', 'devices:read'] },
  { id: 'r4', name: 'リリース管理者', description: 'ソフト配信の承認・実行', userCount: 3, permissions: ['releases', 'deployments'] },
  { id: 'r5', name: '顧客（閲覧）', description: '自社データの閲覧のみ', userCount: 15, permissions: ['dashboard:read', 'devices:read:own'] },
];

const auditLogs = [
  { id: 'al1', action: 'リリース承認', user: '鈴木 一郎', target: 'v3.5.0', timestamp: '2024-01-15 11:00', status: 'success' },
  { id: 'al2', action: 'ユーザー作成', user: '管理者', target: 'test@example.com', timestamp: '2024-01-15 10:45', status: 'success' },
  { id: 'al3', action: '配信開始', user: '鈴木 一郎', target: 'v3.5.0', timestamp: '2024-01-15 10:30', status: 'success' },
  { id: 'al4', action: 'チケット更新', user: '田中 花子', target: 'TKT-2024-00001', timestamp: '2024-01-15 10:15', status: 'success' },
  { id: 'al5', action: 'ログイン', user: '山田 太郎', target: '-', timestamp: '2024-01-15 08:00', status: 'success' },
  { id: 'al6', action: 'ログイン失敗', user: 'unknown@test.com', target: '-', timestamp: '2024-01-15 03:22', status: 'failed' },
];

const pendingApprovals = [
  { id: 'ap1', type: 'リリース', title: 'v3.6.0 テスト環境配信', requester: '高橋 美咲', requestedAt: '2024-01-15 09:00' },
  { id: 'ap2', type: '権限変更', title: '田中花子のロール変更', requester: '管理者', requestedAt: '2024-01-14 16:00' },
];

export default function AdminDashboard() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [dbUserCount, setDbUserCount] = useState<number | null>(null);
  const [ruleCount, setRuleCount] = useState<number | null>(null);

  useEffect(() => {
    // Fetch real counts from database
    async function fetchCounts() {
      try {
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        const { count: rulesCount } = await supabase
          .from('escalation_rules')
          .select('*', { count: 'exact', head: true });
        
        setDbUserCount(usersCount || 0);
        setRuleCount(rulesCount || 0);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    }

    if (user) {
      fetchCounts();
    }
  }, [user]);

  // Redirect non-admin users
  useEffect(() => {
    if (!authLoading && user && !hasRole('admin') && !hasRole('manager')) {
      navigate('/');
    }
  }, [authLoading, user, hasRole, navigate]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Shield className="h-16 w-16 text-muted-foreground/50" />
        <h2 className="mt-4 text-xl font-semibold">アクセス権限が必要です</h2>
        <p className="mt-2 text-muted-foreground">このページを表示するにはログインしてください</p>
        <Button className="mt-4" asChild>
          <Link to="/auth">ログイン</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">権限・監査</h1>
          <p className="mt-1 text-muted-foreground">
            RBAC、テナント分離、操作ログ、ワークフロー自動化
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            証跡エクスポート
          </Button>
        </div>
      </div>

      {/* Pending Approvals */}
      {pendingApprovals.length > 0 && (
        <div className="rounded-lg border border-status-warning bg-status-warning-bg p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-status-warning" />
            <h2 className="font-semibold">承認待ち ({pendingApprovals.length}件)</h2>
          </div>
          <div className="mt-4 space-y-2">
            {pendingApprovals.map((approval) => (
              <div
                key={approval.id}
                className="flex items-center justify-between rounded-lg bg-card p-3"
              >
                <div>
                  <span className="rounded bg-muted px-2 py-0.5 text-xs">{approval.type}</span>
                  <p className="mt-1 font-medium">{approval.title}</p>
                  <p className="text-sm text-muted-foreground">
                    申請者: {approval.requester} • {approval.requestedAt}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">却下</Button>
                  <Button size="sm">承認</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-5">
        <div className="rounded-lg border bg-card p-4 text-center">
          <Users className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-2 text-2xl font-bold">{dbUserCount ?? users.length}</p>
          <p className="text-sm text-muted-foreground">ユーザー</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <Key className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-2 text-2xl font-bold">{roles.length}</p>
          <p className="text-sm text-muted-foreground">ロール</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <Shield className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-2 text-2xl font-bold">{tenants.length}</p>
          <p className="text-sm text-muted-foreground">テナント</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <Workflow className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-2 text-2xl font-bold">{ruleCount ?? 0}</p>
          <p className="text-sm text-muted-foreground">自動化ルール</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <FileText className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-2 text-2xl font-bold">1,234</p>
          <p className="text-sm text-muted-foreground">監査ログ</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="users">ユーザー管理</TabsTrigger>
          <TabsTrigger value="roles">ロール管理</TabsTrigger>
          <TabsTrigger value="tenants">テナント</TabsTrigger>
          <TabsTrigger value="workflow">ワークフロー</TabsTrigger>
          <TabsTrigger value="logs">監査ログ</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="ユーザー検索..."
                className="search-enterprise w-full pl-9"
              />
            </div>
            <Button className="gap-2">
              <Users className="h-4 w-4" />
              ユーザー追加
            </Button>
          </div>
          <div className="rounded-lg border bg-card">
            <div className="divide-y">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-sm text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="rounded bg-muted px-2 py-1 text-sm">{u.role}</span>
                    <span className="status-badge status-healthy">有効</span>
                    <span className="text-sm text-muted-foreground">{u.lastLogin}</span>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <div className="flex justify-end">
            <Button className="gap-2">
              <Key className="h-4 w-4" />
              ロール作成
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => (
              <div key={role.id} className="rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{role.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{role.description}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {role.userCount}人のユーザー
                  </span>
                  <Button variant="outline" size="sm">権限編集</Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tenants" className="space-y-4">
          <div className="rounded-lg border bg-card">
            <div className="divide-y">
              {tenants.map((tenant) => (
                <div
                  key={tenant.id}
                  className="flex items-center justify-between p-4"
                >
                  <div>
                    <p className="font-medium">{tenant.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {tenant.type} • コード: {tenant.code}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="status-badge status-healthy">有効</span>
                    <Button variant="outline" size="sm">設定</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-4">
          <WorkflowAutomation />
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="ログ検索..."
                  className="search-enterprise w-full pl-9"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                フィルター
              </Button>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              CSV出力
            </Button>
          </div>
          <div className="rounded-lg border bg-card">
            <div className="divide-y">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className={cn(
                    'flex items-center justify-between p-4',
                    log.status === 'failed' && 'bg-status-critical-bg'
                  )}
                >
                  <div className="flex items-center gap-4">
                    {log.status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-status-healthy" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-status-critical" />
                    )}
                    <div>
                      <p className="font-medium">{log.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {log.user} • 対象: {log.target}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
