import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Monitor, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const emailSchema = z.string().email('有効なメールアドレスを入力してください');
const passwordSchema = z.string().min(6, 'パスワードは6文字以上で入力してください');
const displayNameSchema = z.string().min(1, '表示名を入力してください').max(50, '表示名は50文字以内で入力してください');

export default function Auth() {
  const navigate = useNavigate();
  const { user, signIn, signUp, loading: authLoading } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    displayName?: string;
  }>({});

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const validateForm = () => {
    const errors: typeof validationErrors = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      errors.email = emailResult.error.errors[0].message;
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      errors.password = passwordResult.error.errors[0].message;
    }

    if (mode === 'signup') {
      const displayNameResult = displayNameSchema.safeParse(displayName);
      if (!displayNameResult.success) {
        errors.displayName = displayNameResult.error.errors[0].message;
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setError('メールアドレスまたはパスワードが正しくありません');
          } else {
            setError('ログインに失敗しました。しばらくしてから再度お試しください');
          }
        }
      } else {
        const { error } = await signUp(email, password, displayName);
        if (error) {
          if (error.message.includes('User already registered')) {
            setError('このメールアドレスは既に登録されています');
          } else {
            setError('アカウント作成に失敗しました。しばらくしてから再度お試しください');
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden w-1/2 bg-gradient-to-br from-primary to-primary/80 lg:flex lg:flex-col lg:justify-between p-12">
        <div className="flex items-center gap-3">
          <Monitor className="h-8 w-8 text-primary-foreground" />
          <span className="text-2xl font-bold text-primary-foreground">ChannelOps Core</span>
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-primary-foreground">
            チャネル運用統合プラットフォーム
          </h1>
          <p className="text-lg text-primary-foreground/80">
            ATM・キオスク・窓口端末を統合管理。監視、保守、配信を一元化し、運用効率を最大化します。
          </p>
          <div className="grid gap-4 text-primary-foreground/90">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
              <span>リアルタイムアラート監視</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
              <span>インシデント管理・SLA追跡</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
              <span>段階的ソフトウェア配信</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-primary-foreground/60">
          © 2024 ChannelOps Core. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:hidden">
            <div className="flex items-center justify-center gap-2">
              <Monitor className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">ChannelOps Core</span>
            </div>
          </div>

          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold">
              {mode === 'login' ? 'ログイン' : 'アカウント作成'}
            </h2>
            <p className="text-muted-foreground">
              {mode === 'login'
                ? 'アカウント情報を入力してください'
                : '新しいアカウントを作成します'}
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="displayName">表示名</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="田中 太郎"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className={cn('pl-10', validationErrors.displayName && 'border-destructive')}
                  />
                </div>
                {validationErrors.displayName && (
                  <p className="text-sm text-destructive">{validationErrors.displayName}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn('pl-10', validationErrors.email && 'border-destructive')}
                />
              </div>
              {validationErrors.email && (
                <p className="text-sm text-destructive">{validationErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn('pl-10', validationErrors.password && 'border-destructive')}
                />
              </div>
              {validationErrors.password && (
                <p className="text-sm text-destructive">{validationErrors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  処理中...
                </div>
              ) : mode === 'login' ? (
                'ログイン'
              ) : (
                'アカウントを作成'
              )}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError(null);
                setValidationErrors({});
              }}
              className="text-sm text-primary hover:underline"
            >
              {mode === 'login'
                ? 'アカウントをお持ちでない方はこちら'
                : '既にアカウントをお持ちの方はこちら'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
