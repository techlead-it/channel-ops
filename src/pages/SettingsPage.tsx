import { Settings as SettingsIcon, Bell, Monitor, Globe, Palette, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">設定</h1>
        <p className="mt-1 text-muted-foreground">
          アプリケーションの表示・通知設定
        </p>
      </div>

      {/* Notification Settings */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">通知設定</h2>
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>重大アラート通知</Label>
              <p className="text-sm text-muted-foreground">重大アラート発生時に通知</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>チケット更新通知</Label>
              <p className="text-sm text-muted-foreground">担当チケットの更新時に通知</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>配信完了通知</Label>
              <p className="text-sm text-muted-foreground">ソフト配信完了時に通知</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>メール通知</Label>
              <p className="text-sm text-muted-foreground">重要な通知をメールでも受信</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-2">
          <Monitor className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">表示設定</h2>
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>コンパクト表示</Label>
              <p className="text-sm text-muted-foreground">一覧画面の行間を狭く</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>ダッシュボード自動更新</Label>
              <p className="text-sm text-muted-foreground">30秒ごとにデータを更新</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>アニメーション</Label>
              <p className="text-sm text-muted-foreground">UI アニメーションを有効化</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      {/* Language Settings */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">言語・地域</h2>
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>言語</Label>
              <p className="text-sm text-muted-foreground">表示言語を選択</p>
            </div>
            <select className="rounded-md border bg-background px-3 py-2">
              <option value="ja">日本語</option>
              <option value="en">English</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>タイムゾーン</Label>
              <p className="text-sm text-muted-foreground">日時表示のタイムゾーン</p>
            </div>
            <select className="rounded-md border bg-background px-3 py-2">
              <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>日付形式</Label>
              <p className="text-sm text-muted-foreground">日付の表示形式</p>
            </div>
            <select className="rounded-md border bg-background px-3 py-2">
              <option value="yyyy/MM/dd">2024/01/15</option>
              <option value="yyyy-MM-dd">2024-01-15</option>
              <option value="MM/dd/yyyy">01/15/2024</option>
            </select>
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">テーマ</h2>
        </div>
        <div className="mt-6">
          <div className="flex gap-4">
            <button className="flex flex-col items-center gap-2 rounded-lg border-2 border-primary p-4">
              <Sun className="h-6 w-6" />
              <span className="text-sm font-medium">ライト</span>
            </button>
            <button className="flex flex-col items-center gap-2 rounded-lg border p-4 hover:border-primary">
              <Moon className="h-6 w-6" />
              <span className="text-sm font-medium">ダーク</span>
            </button>
            <button className="flex flex-col items-center gap-2 rounded-lg border p-4 hover:border-primary">
              <Monitor className="h-6 w-6" />
              <span className="text-sm font-medium">システム</span>
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button>設定を保存</Button>
      </div>
    </div>
  );
}
