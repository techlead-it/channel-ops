import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { devices } from '@/data/demoData';

const statusColors = {
  online: 'hsl(142, 71%, 45%)',
  warning: 'hsl(38, 92%, 50%)',
  error: 'hsl(0, 84%, 60%)',
  offline: 'hsl(220, 9%, 46%)',
  maintenance: 'hsl(217, 91%, 60%)',
};

const statusLabels = {
  online: '稼働中',
  warning: '警告',
  error: '障害',
  offline: 'オフライン',
  maintenance: 'メンテナンス',
};

export function StatusChart() {
  const statusCounts = devices.reduce((acc, device) => {
    acc[device.status] = (acc[device.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(statusCounts).map(([status, count]) => ({
    name: statusLabels[status as keyof typeof statusLabels],
    value: count,
    color: statusColors[status as keyof typeof statusColors],
  }));

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="mb-4 font-semibold">端末ステータス分布</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
              }}
              formatter={(value: number) => [`${value}台`, '']}
            />
            <Legend
              formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-5 gap-2">
        {data.map((item) => (
          <div key={item.name} className="text-center">
            <div
              className="mx-auto h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <p className="mt-1 text-xs text-muted-foreground">{item.name}</p>
            <p className="font-mono-num text-sm font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
