// Demo data for ChannelOps Core

export interface Tenant {
  id: string;
  name: string;
  type: '金融機関' | '自治体' | '小売' | '医療';
  code: string;
}

export interface Site {
  id: string;
  tenantId: string;
  name: string;
  address: string;
  region: string;
  lat?: number;
  lng?: number;
}

export interface Device {
  id: string;
  tenantId: string;
  siteId: string;
  deviceCode: string;
  type: 'ATM' | 'キオスク' | '窓口端末' | '精算機' | 'ロボット';
  model: string;
  manufacturer: string;
  status: 'online' | 'warning' | 'error' | 'offline' | 'maintenance';
  osVersion: string;
  appVersion: string;
  lastHeartbeat: string;
  installedDate: string;
  warrantyExpiry: string;
  modules: DeviceModule[];
}

export interface DeviceModule {
  id: string;
  type: '紙幣' | 'カード' | 'QR' | 'プリンター' | '認証' | 'カメラ';
  model: string;
  status: 'ok' | 'warning' | 'error';
  lastMaintenance?: string;
}

export interface Alert {
  id: string;
  deviceId: string;
  tenantId: string;
  siteId: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'hardware' | 'software' | 'network' | 'security';
  title: string;
  message: string;
  status: 'new' | 'acknowledged' | 'investigating' | 'resolved';
  assignee?: string;
  createdAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  tenantId: string;
  siteId: string;
  deviceId?: string;
  alertId?: string;
  type: '障害' | '問合せ' | '作業依頼' | '変更要求';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
  assignee?: string;
  slaDeadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface Release {
  id: string;
  version: string;
  name: string;
  description: string;
  targetDeviceTypes: string[];
  status: 'draft' | 'testing' | 'approved' | 'deploying' | 'completed' | 'rollback';
  rolloutPercentage: number;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface Deployment {
  id: string;
  releaseId: string;
  deviceId: string;
  status: 'pending' | 'downloading' | 'installing' | 'success' | 'failed' | 'rollback';
  progress: number;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
}

export interface ExternalConnection {
  id: string;
  name: string;
  type: '決済' | '自治体連携' | '外部機関';
  provider: string;
  status: 'healthy' | 'degraded' | 'error';
  latencyMs: number;
  messageCount24h: number;
  lastHealthCheck: string;
}

// Demo Tenants
export const tenants: Tenant[] = [
  { id: 't1', name: '東京第一銀行', type: '金融機関', code: 'TDB' },
  { id: 't2', name: '横浜市役所', type: '自治体', code: 'YKH' },
  { id: 't3', name: 'マートチェーン', type: '小売', code: 'MTC' },
  { id: 't4', name: '中央総合病院', type: '医療', code: 'CHH' },
];

// Demo Sites
export const sites: Site[] = [
  // 東京第一銀行
  { id: 's1', tenantId: 't1', name: '本店営業部', address: '東京都千代田区丸の内1-1-1', region: '東京', lat: 35.6812, lng: 139.7671 },
  { id: 's2', tenantId: 't1', name: '新宿支店', address: '東京都新宿区西新宿2-2-2', region: '東京', lat: 35.6896, lng: 139.6918 },
  { id: 's3', tenantId: 't1', name: '横浜支店', address: '神奈川県横浜市中区本町3-3-3', region: '神奈川', lat: 35.4437, lng: 139.6380 },
  // 横浜市役所
  { id: 's4', tenantId: 't2', name: '本庁舎', address: '神奈川県横浜市中区港町1-1', region: '神奈川', lat: 35.4467, lng: 139.6425 },
  { id: 's5', tenantId: 't2', name: '青葉区役所', address: '神奈川県横浜市青葉区市ケ尾町31-4', region: '神奈川', lat: 35.5513, lng: 139.5458 },
  { id: 's6', tenantId: 't2', name: '港北区役所', address: '神奈川県横浜市港北区大豆戸町26-1', region: '神奈川', lat: 35.5117, lng: 139.6286 },
  // マートチェーン
  { id: 's7', tenantId: 't3', name: '渋谷店', address: '東京都渋谷区道玄坂1-1-1', region: '東京', lat: 35.6580, lng: 139.7016 },
  { id: 's8', tenantId: 't3', name: '池袋店', address: '東京都豊島区南池袋2-2-2', region: '東京', lat: 35.7295, lng: 139.7109 },
  { id: 's9', tenantId: 't3', name: '品川店', address: '東京都港区港南2-3-3', region: '東京', lat: 35.6284, lng: 139.7387 },
  // 中央総合病院
  { id: 's10', tenantId: 't4', name: '本館', address: '東京都中央区日本橋1-1-1', region: '東京', lat: 35.6839, lng: 139.7744 },
  { id: 's11', tenantId: 't4', name: '別館', address: '東京都中央区日本橋2-2-2', region: '東京', lat: 35.6825, lng: 139.7730 },
  { id: 's12', tenantId: 't4', name: '健診センター', address: '東京都中央区銀座3-3-3', region: '東京', lat: 35.6721, lng: 139.7636 },
];

// Device types by tenant
const deviceTemplates = {
  金融機関: [
    { type: 'ATM' as const, models: ['NCR SelfServ 80', 'Diebold Nixdorf DN200', 'Hitachi HT-2845'] },
    { type: '窓口端末' as const, models: ['富士通 FMVC', 'NEC Mate'] },
  ],
  自治体: [
    { type: 'キオスク' as const, models: ['パナソニック JT-VT10', 'シャープ IG-A100'] },
    { type: '窓口端末' as const, models: ['富士通 LIFEBOOK', 'レノボ ThinkCentre'] },
  ],
  小売: [
    { type: 'キオスク' as const, models: ['東芝テック ST-86', 'NCR RealPOS'] },
    { type: '精算機' as const, models: ['グローリー RT-300', 'ローレル LCA-6'] },
  ],
  医療: [
    { type: '精算機' as const, models: ['パナソニック JT-VT30', 'アルメックス APS-3'] },
    { type: 'キオスク' as const, models: ['富士通 KIOSK-F', 'NEC KIOSK'] },
  ],
};

const moduleTypes: DeviceModule['type'][] = ['紙幣', 'カード', 'QR', 'プリンター', '認証', 'カメラ'];

function generateDevices(): Device[] {
  const devices: Device[] = [];
  let deviceIndex = 1;

  sites.forEach((site) => {
    const tenant = tenants.find(t => t.id === site.tenantId)!;
    const templates = deviceTemplates[tenant.type];
    
    for (let i = 0; i < 5; i++) {
      const template = templates[i % templates.length];
      const model = template.models[Math.floor(Math.random() * template.models.length)];
      const statuses: Device['status'][] = ['online', 'online', 'online', 'online', 'warning', 'error', 'offline', 'maintenance'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      const modules: DeviceModule[] = [];
      const numModules = 3 + Math.floor(Math.random() * 3);
      const shuffledTypes = [...moduleTypes].sort(() => Math.random() - 0.5);
      
      for (let j = 0; j < numModules; j++) {
        const moduleStatuses: DeviceModule['status'][] = ['ok', 'ok', 'ok', 'warning', 'error'];
        modules.push({
          id: `m${deviceIndex}-${j}`,
          type: shuffledTypes[j],
          model: `Module-${shuffledTypes[j]}-v${Math.floor(Math.random() * 3) + 1}`,
          status: moduleStatuses[Math.floor(Math.random() * moduleStatuses.length)],
          lastMaintenance: '2024-01-15',
        });
      }

      devices.push({
        id: `d${deviceIndex}`,
        tenantId: site.tenantId,
        siteId: site.id,
        deviceCode: `${tenant.code}-${site.id.slice(1)}-${String(i + 1).padStart(3, '0')}`,
        type: template.type,
        model,
        manufacturer: model.split(' ')[0],
        status,
        osVersion: 'Windows 10 IoT LTSC 2021',
        appVersion: `3.${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}`,
        lastHeartbeat: new Date(Date.now() - Math.random() * 300000).toISOString(),
        installedDate: '2023-04-15',
        warrantyExpiry: '2026-04-15',
        modules,
      });
      
      deviceIndex++;
    }
  });

  return devices;
}

export const devices = generateDevices();

// Generate alerts
function generateAlerts(): Alert[] {
  const alerts: Alert[] = [];
  const severities: Alert['severity'][] = ['critical', 'high', 'medium', 'low'];
  const types: Alert['type'][] = ['hardware', 'software', 'network', 'security'];
  const statuses: Alert['status'][] = ['new', 'acknowledged', 'investigating', 'resolved'];
  
  const alertTemplates = [
    { title: '紙幣ジャム発生', message: '紙幣ユニットでジャムが検出されました。現地確認が必要です。', type: 'hardware' as const },
    { title: 'カード読取エラー', message: 'ICカードリーダーでエラーが発生しています。', type: 'hardware' as const },
    { title: 'ネットワーク接続断', message: 'ホストへの接続が10分以上途絶しています。', type: 'network' as const },
    { title: 'ディスク容量警告', message: 'システムディスクの空き容量が10%を下回りました。', type: 'software' as const },
    { title: 'アプリケーションクラッシュ', message: 'メインアプリケーションが予期せず終了しました。', type: 'software' as const },
    { title: '認証失敗多発', message: '短時間に複数回の認証失敗が検出されました。', type: 'security' as const },
    { title: 'ハードウェア温度異常', message: 'CPU温度が警告閾値を超過しています。', type: 'hardware' as const },
    { title: 'プリンター紙切れ', message: 'レシートプリンターの用紙がなくなりました。', type: 'hardware' as const },
  ];

  const errorDevices = devices.filter(d => d.status === 'error' || d.status === 'warning');
  
  // Critical alerts (10)
  for (let i = 0; i < 10; i++) {
    const device = errorDevices[i % errorDevices.length] || devices[i];
    const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
    alerts.push({
      id: `a${i + 1}`,
      deviceId: device.id,
      tenantId: device.tenantId,
      siteId: device.siteId,
      severity: i < 5 ? 'critical' : 'high',
      type: template.type,
      title: template.title,
      message: template.message,
      status: statuses[Math.floor(Math.random() * 3)], // Not resolved
      assignee: i < 3 ? '山田 太郎' : undefined,
      createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    });
  }

  // Warning alerts (30)
  for (let i = 10; i < 40; i++) {
    const device = devices[i % devices.length];
    const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
    alerts.push({
      id: `a${i + 1}`,
      deviceId: device.id,
      tenantId: device.tenantId,
      siteId: device.siteId,
      severity: severities[Math.floor(Math.random() * 2) + 2], // medium or low
      type: template.type,
      title: template.title,
      message: template.message,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: new Date(Date.now() - Math.random() * 172800000).toISOString(),
    });
  }

  return alerts.sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}

export const alerts = generateAlerts();

// Generate tickets
function generateTickets(): Ticket[] {
  const tickets: Ticket[] = [];
  const types: Ticket['type'][] = ['障害', '問合せ', '作業依頼', '変更要求'];
  const priorities: Ticket['priority'][] = ['urgent', 'high', 'medium', 'low'];
  const statuses: Ticket['status'][] = ['open', 'in_progress', 'pending', 'resolved', 'closed'];
  
  const ticketTemplates = [
    { title: 'ATM紙幣ジャム対応', description: '紙幣ユニットでジャムが発生。現地対応が必要。' },
    { title: 'ソフトウェア更新依頼', description: 'セキュリティパッチの適用を依頼します。' },
    { title: '定期保守作業', description: '月次定期保守作業の実施依頼。' },
    { title: '新規端末設置', description: '新店舗への端末設置作業。' },
    { title: 'ネットワーク障害調査', description: '接続不安定のため調査依頼。' },
    { title: '画面表示カスタマイズ', description: '初期画面のロゴ変更依頼。' },
  ];

  // In progress (20)
  for (let i = 0; i < 20; i++) {
    const device = devices[i % devices.length];
    const template = ticketTemplates[Math.floor(Math.random() * ticketTemplates.length)];
    tickets.push({
      id: `t${i + 1}`,
      ticketNumber: `TKT-2024-${String(i + 1).padStart(5, '0')}`,
      tenantId: device.tenantId,
      siteId: device.siteId,
      deviceId: device.id,
      type: types[Math.floor(Math.random() * types.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      title: template.title,
      description: template.description,
      status: ['open', 'in_progress', 'pending'][Math.floor(Math.random() * 3)] as Ticket['status'],
      assignee: i < 10 ? '田中 花子' : '佐藤 次郎',
      slaDeadline: new Date(Date.now() + Math.random() * 172800000).toISOString(),
      createdAt: new Date(Date.now() - Math.random() * 604800000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    });
  }

  // Completed (50)
  for (let i = 20; i < 70; i++) {
    const device = devices[i % devices.length];
    const template = ticketTemplates[Math.floor(Math.random() * ticketTemplates.length)];
    tickets.push({
      id: `t${i + 1}`,
      ticketNumber: `TKT-2024-${String(i + 1).padStart(5, '0')}`,
      tenantId: device.tenantId,
      siteId: device.siteId,
      deviceId: device.id,
      type: types[Math.floor(Math.random() * types.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      title: template.title,
      description: template.description,
      status: ['resolved', 'closed'][Math.floor(Math.random() * 2)] as Ticket['status'],
      slaDeadline: new Date(Date.now() - Math.random() * 604800000).toISOString(),
      createdAt: new Date(Date.now() - Math.random() * 2592000000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 604800000).toISOString(),
    });
  }

  return tickets;
}

export const tickets = generateTickets();

// Releases
export const releases: Release[] = [
  {
    id: 'r1',
    version: '3.5.0',
    name: 'セキュリティアップデート 2024-01',
    description: 'TLS 1.3対応、脆弱性修正、パフォーマンス改善',
    targetDeviceTypes: ['ATM', 'キオスク'],
    status: 'deploying',
    rolloutPercentage: 45,
    createdAt: '2024-01-10T09:00:00Z',
    approvedBy: '鈴木 一郎',
    approvedAt: '2024-01-12T14:30:00Z',
  },
  {
    id: 'r2',
    version: '3.4.2',
    name: 'UI改善リリース',
    description: 'ユーザビリティ改善、フォント調整、多言語対応追加',
    targetDeviceTypes: ['ATM', 'キオスク', '窓口端末'],
    status: 'completed',
    rolloutPercentage: 100,
    createdAt: '2023-12-01T09:00:00Z',
    approvedBy: '高橋 美咲',
    approvedAt: '2023-12-05T10:00:00Z',
  },
];

// External Connections
export const externalConnections: ExternalConnection[] = [
  {
    id: 'ec1',
    name: 'PayB決済ゲートウェイ',
    type: '決済',
    provider: 'ビリングシステム',
    status: 'healthy',
    latencyMs: 45,
    messageCount24h: 125000,
    lastHealthCheck: new Date(Date.now() - 60000).toISOString(),
  },
  {
    id: 'ec2',
    name: '自治体連携基盤',
    type: '自治体連携',
    provider: 'LGWAN',
    status: 'healthy',
    latencyMs: 120,
    messageCount24h: 8500,
    lastHealthCheck: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: 'ec3',
    name: 'マイナンバー照会',
    type: '外部機関',
    provider: 'J-LIS',
    status: 'degraded',
    latencyMs: 850,
    messageCount24h: 3200,
    lastHealthCheck: new Date(Date.now() - 180000).toISOString(),
  },
];

// Helper functions
export function getDevicesBySite(siteId: string): Device[] {
  return devices.filter(d => d.siteId === siteId);
}

export function getAlertsByDevice(deviceId: string): Alert[] {
  return alerts.filter(a => a.deviceId === deviceId);
}

export function getTicketsByTenant(tenantId: string): Ticket[] {
  return tickets.filter(t => t.tenantId === tenantId);
}

export function calculateMetrics() {
  const totalDevices = devices.length;
  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const errorDevices = devices.filter(d => d.status === 'error').length;
  const warningDevices = devices.filter(d => d.status === 'warning').length;
  const offlineDevices = devices.filter(d => d.status === 'offline').length;
  
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && a.status !== 'resolved').length;
  const openTickets = tickets.filter(t => ['open', 'in_progress', 'pending'].includes(t.status)).length;
  
  return {
    totalDevices,
    onlineDevices,
    errorDevices,
    warningDevices,
    offlineDevices,
    onlineRate: ((onlineDevices / totalDevices) * 100).toFixed(1),
    criticalAlerts,
    openTickets,
    mttr: '2.4', // Mean Time To Repair (hours)
  };
}
