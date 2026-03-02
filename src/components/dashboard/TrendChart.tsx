import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Generate mock trend data for last 24 hours
const generateTrendData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = time.getHours();
    
    // Simulate realistic patterns
    const baseOnline = 55;
    const variance = Math.sin(hour / 24 * Math.PI * 2) * 3;
    const random = (Math.random() - 0.5) * 2;
    
    const online = Math.round(baseOnline + variance + random);
    const warning = Math.round(3 + Math.random() * 2);
    const error = Math.round(1 + Math.random() * 2);
    const offline = 60 - online - warning - error;
    
    data.push({
      time: `${String(hour).padStart(2, '0')}:00`,
      稼働中: online,
      警告: warning,
      障害: error,
      オフライン: Math.max(0, offline),
    });
  }
  
  return data;
};

const trendData = generateTrendData();

export function TrendChart() {
  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="mb-4 font-semibold">24時間稼働推移</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorOnline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorWarning" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorError" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
              }}
            />
            <Area
              type="monotone"
              dataKey="稼働中"
              stackId="1"
              stroke="hsl(142, 71%, 45%)"
              fill="url(#colorOnline)"
            />
            <Area
              type="monotone"
              dataKey="警告"
              stackId="1"
              stroke="hsl(38, 92%, 50%)"
              fill="url(#colorWarning)"
            />
            <Area
              type="monotone"
              dataKey="障害"
              stackId="1"
              stroke="hsl(0, 84%, 60%)"
              fill="url(#colorError)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
