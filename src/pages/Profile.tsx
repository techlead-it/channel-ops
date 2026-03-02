import { User, Mail, Phone, Building2, Shield, Clock, Edit, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Profile() {
  const user = {
    name: '管理者',
    email: 'admin@hcs.co.jp',
    phone: '03-1234-5678',
    department: 'システム運用部',
    role: 'システム管理者',
    lastLogin: '2024-01-15 10:30',
    createdAt: '2023-04-01',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl text-primary-foreground">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.role}</p>
            <p className="mt-1 text-sm text-muted-foreground">{user.department}</p>
          </div>
        </div>
        <Button className="gap-2">
          <Edit className="h-4 w-4" />
          プロフィール編集
        </Button>
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">基本情報</TabsTrigger>
          <TabsTrigger value="security">セキュリティ</TabsTrigger>
          <TabsTrigger value="activity">アクティビティ</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold">連絡先情報</h2>
            <dl className="mt-6 space-y-4">
              <div className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <dt className="text-sm text-muted-foreground">メールアドレス</dt>
                  <dd className="font-medium">{user.email}</dd>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <dt className="text-sm text-muted-foreground">電話番号</dt>
                  <dd className="font-medium">{user.phone}</dd>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <dt className="text-sm text-muted-foreground">部署</dt>
                  <dd className="font-medium">{user.department}</dd>
                </div>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold">アカウント情報</h2>
            <dl className="mt-6 space-y-4">
              <div className="flex items-center gap-4">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <dt className="text-sm text-muted-foreground">ロール</dt>
                  <dd className="font-medium">{user.role}</dd>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <dt className="text-sm text-muted-foreground">最終ログイン</dt>
                  <dd className="font-medium">{user.lastLogin}</dd>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <dt className="text-sm text-muted-foreground">アカウント作成日</dt>
                  <dd className="font-medium">{user.createdAt}</dd>
                </div>
              </div>
            </dl>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold">パスワード</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              最後の変更: 30日前
            </p>
            <Button variant="outline" className="mt-4 gap-2">
              <Key className="h-4 w-4" />
              パスワード変更
            </Button>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold">二要素認証</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              二要素認証は有効になっています。
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="status-badge status-healthy">有効</span>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold">アクティブセッション</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">現在のセッション</p>
                  <p className="text-sm text-muted-foreground">Chrome on Windows • Tokyo, Japan</p>
                </div>
                <span className="status-badge status-healthy">アクティブ</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold">最近のアクティビティ</h2>
            <div className="mt-4 space-y-4">
              {[
                { action: 'ログイン', time: '2024-01-15 10:30', ip: '192.168.1.100' },
                { action: 'チケット更新', time: '2024-01-15 10:15', target: 'TKT-2024-00001' },
                { action: 'リリース承認', time: '2024-01-15 09:45', target: 'v3.5.0' },
                { action: 'ログイン', time: '2024-01-14 09:00', ip: '192.168.1.100' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.target || activity.ip}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
