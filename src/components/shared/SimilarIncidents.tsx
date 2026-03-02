import { Link } from 'react-router-dom';
import { Lightbulb, Clock, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface SimilarIncident {
  id: string;
  ticketNumber: string;
  title: string;
  resolvedAt: Date;
  resolution: string;
  matchScore: number;
}

interface SimilarIncidentsProps {
  currentAlertTitle: string;
  deviceType: string;
  alertType: string;
}

// Mock similar incidents - would be from a knowledge base in real app
const mockSimilarIncidents: SimilarIncident[] = [
  {
    id: 't15',
    ticketNumber: 'TKT-2024-00015',
    title: '紙幣ジャム対応（同一機種）',
    resolvedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    resolution: 'ジャムセンサー清掃と紙幣ユニットのキャリブレーション実施で解決',
    matchScore: 92,
  },
  {
    id: 't28',
    ticketNumber: 'TKT-2024-00028',
    title: '紙幣ユニット障害',
    resolvedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    resolution: 'ベルト交換により復旧。部品寿命による摩耗が原因。',
    matchScore: 85,
  },
  {
    id: 't42',
    ticketNumber: 'TKT-2024-00042',
    title: '入金時の紙幣詰まり',
    resolvedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    resolution: '紙幣ガイドの調整とローラー清掃で改善',
    matchScore: 78,
  },
];

export function SimilarIncidents({ currentAlertTitle, deviceType, alertType }: SimilarIncidentsProps) {
  // In a real app, this would search the knowledge base
  const similarIncidents = mockSimilarIncidents;

  if (similarIncidents.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="h-4 w-4 text-status-warning" />
        <h3 className="font-medium">類似障害（ナレッジ）</h3>
      </div>

      <div className="space-y-3">
        {similarIncidents.map((incident) => (
          <div
            key={incident.id}
            className="rounded-lg border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">
                    {incident.ticketNumber}
                  </span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-medium',
                      incident.matchScore >= 90
                        ? 'bg-status-healthy-bg text-status-healthy'
                        : incident.matchScore >= 80
                        ? 'bg-status-warning-bg text-status-warning'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {incident.matchScore}% 類似
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium">{incident.title}</p>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {incident.resolution}
                </p>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-status-healthy" />
                    解決済み
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(incident.resolvedAt, { addSuffix: true, locale: ja })}
                  </span>
                </div>
              </div>
              <Link to={`/tickets/${incident.id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t">
        <Button variant="outline" size="sm" className="w-full">
          ナレッジベースを検索
        </Button>
      </div>
    </div>
  );
}
