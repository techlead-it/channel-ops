import { Construction } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const pageInfo: Record<string, { title: string; description: string }> = {
  '/work-orders': {
    title: '作業・保守',
    description: '当日作業リスト、現場チェックリスト、交換部品登録、作業報告書PDF出力',
  },
  '/releases': {
    title: 'ソフト配信・リリース管理',
    description: '段階ロールアウト（1%→10%→50%→100%）、失敗時ロールバック、配信結果追跡',
  },
  '/templates': {
    title: '申請/受付テンプレート',
    description: '申請種別テンプレ管理、本人確認フロー、OCR項目マッピング、自治体カスタム差分管理',
  },
  '/reports': {
    title: 'レポート/分析',
    description: '稼働率、障害傾向、予兆分析、契約別コスト、保守員稼働・生産性',
  },
  '/admin': {
    title: '権限・監査',
    description: 'RBAC、顧客テナント分離、操作ログ、変更履歴、証跡エクスポート、二段階承認',
  },
};

export default function Placeholder() {
  const location = useLocation();
  const info = pageInfo[location.pathname] || {
    title: 'ページ',
    description: 'このページは開発中です',
  };

  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Construction className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="mt-4 text-2xl font-bold">{info.title}</h1>
        <p className="mt-2 max-w-md text-muted-foreground">{info.description}</p>
        <p className="mt-4 text-sm text-muted-foreground">
          このページは今後実装予定です
        </p>
      </div>
    </div>
  );
}
