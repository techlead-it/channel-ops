import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Monitor,
  AlertTriangle,
  Ticket,
  Upload,
  Link2,
  FileText,
  BarChart3,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const WELCOME_SHOWN_KEY = 'channelops_welcome_shown';

interface WelcomeModalProps {
  forceOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const features = [
  {
    icon: Monitor,
    title: '端末台帳（CMDB）',
    description: 'ATM・キオスク・窓口端末を一元管理。設置から廃棄まで全ライフサイクルを追跡。',
    color: 'text-primary',
  },
  {
    icon: AlertTriangle,
    title: '監視・アラート（NOC）',
    description: 'リアルタイム監視で障害を即座に検知。エスカレーションルールで迅速対応。',
    color: 'text-status-warning',
  },
  {
    icon: Ticket,
    title: 'チケット管理（ITSM）',
    description: '障害・問合せ・作業依頼を統合管理。SLA監視で対応漏れを防止。',
    color: 'text-status-info',
  },
  {
    icon: Upload,
    title: 'リリース管理',
    description: 'ソフトウェア配信を計画・実行・追跡。段階ロールアウトで安全に展開。',
    color: 'text-status-healthy',
  },
  {
    icon: Link2,
    title: '外部接続ハブ',
    description: '決済ネットワーク・外部機関との接続を一元化。PayB方式で短期導入。',
    color: 'text-primary',
  },
  {
    icon: FileText,
    title: 'テンプレート管理',
    description: '窓口業務を標準化。差分管理で拠点ごとのカスタマイズも対応。',
    color: 'text-muted-foreground',
  },
];

const valueProps = [
  { label: '運用コスト削減', value: '30%' },
  { label: '障害対応時間短縮', value: '50%' },
  { label: 'SLA達成率', value: '99.5%' },
];

export function WelcomeModal({ forceOpen, onOpenChange }: WelcomeModalProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (forceOpen !== undefined) {
      setOpen(forceOpen);
      return;
    }

    // Check if welcome has been shown before
    const hasShown = localStorage.getItem(WELCOME_SHOWN_KEY);
    if (!hasShown) {
      setOpen(true);
    }
  }, [forceOpen]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
    if (!newOpen) {
      localStorage.setItem(WELCOME_SHOWN_KEY, 'true');
    }
  };

  const handleNext = () => {
    if (step < 1) {
      setStep(step + 1);
    } else {
      handleOpenChange(false);
    }
  };

  const handleSkip = () => {
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BarChart3 className="h-6 w-6" />
            </div>
            ChannelOps Core へようこそ
          </DialogTitle>
          <DialogDescription className="text-base">
            チャネル運用統合プラットフォーム - 金融機関・自治体・医療機関向け
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto py-4">
          {step === 0 ? (
            <div className="space-y-6">
              {/* Value Proposition */}
              <div className="rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4">
                <h3 className="font-semibold mb-3">統合管理で実現する価値</h3>
                <div className="grid grid-cols-3 gap-4">
                  {valueProps.map((prop) => (
                    <div key={prop.label} className="text-center">
                      <p className="font-mono-num text-3xl font-bold text-primary">
                        {prop.value}
                      </p>
                      <p className="text-sm text-muted-foreground">{prop.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Overview */}
              <div>
                <h3 className="font-semibold mb-3">システム概要</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  ChannelOps Core は、ATM・キオスク・窓口端末などの多様な自動化機器を
                  統合管理するプラットフォームです。端末の導入から運用・保守・配信・
                  監査までのライフサイクル全体を一気通貫で管理し、
                  高い安定稼働と省力化、安全な変更管理、データ活用を実現します。
                </p>
              </div>

              {/* Architecture */}
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-3">4つのコアコンセプト</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="font-medium text-sm">🔗 統合管理</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      台帳・監視・作業・配信を一元化
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="font-medium text-sm">🌐 接続ハブ</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      外部決済・機関連携を短期導入
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="font-medium text-sm">📋 テンプレ化</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      窓口業務を標準化、差分のみ管理
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="font-medium text-sm">🔌 標準IF対応</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      CEN/XFS対応でマルチベンダー
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-semibold">主な機能</h3>
              <div className="grid gap-3">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className={cn('mt-0.5', feature.color)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{feature.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center gap-2 py-2">
          {[0, 1].map((s) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={cn(
                'h-2 rounded-full transition-all',
                step === s ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/30'
              )}
            />
          ))}
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button variant="ghost" onClick={handleSkip}>
            スキップ
          </Button>
          <Button onClick={handleNext} className="gap-2">
            {step < 1 ? (
              <>
                次へ
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                はじめる
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Reset function for testing
export function resetWelcomeModal() {
  localStorage.removeItem(WELCOME_SHOWN_KEY);
}
