import {
  ReceiptText,
  CalendarClock,
  ShieldCheck,
  Clock,
  ExternalLink,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import ChartCard from '@/components/ui/ChartCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { useTheme } from '@/contexts/ThemeContext';
import { getChartTheme } from '@/lib/chartTheme';
import {
  demoMonthlyReturns,
  demoByOffice,
  demoByCategory,
  demoReceipts,
  demoActivity,
} from '@/lib/demoData';

function ChartTooltip({ active, payload, label, ct, unit = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-lg"
      style={{ background: ct.tooltipBg, borderColor: ct.tooltipBorder, color: ct.tooltipText }}
    >
      {label != null && <p className="mb-1 font-semibold">{label}</p>}
      {payload.map((p) => (
        <p key={p.dataKey ?? p.name} className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-sm" style={{ background: p.color || p.payload?.fill }} />
          {p.name}: <span className="font-semibold tabular-nums">{p.value}{unit}</span>
        </p>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { theme } = useTheme();
  const ct = getChartTheme(theme);

  const totalReceipts = demoReceipts.length;
  const todayCount = demoReceipts.filter((r) => r.return_date === '2026-07-23').length;
  const verifiedCount = demoReceipts.filter((r) => r.status === 'blockchain_verified').length;
  const pendingCount = demoReceipts.filter(
    (r) => r.status === 'blockchain_pending' || r.status === 'submitted',
  ).length;

  const categoryTotal = demoByCategory.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of returned expendable property and blockchain verification status."
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Returned Receipts" value={totalReceipts} icon={ReceiptText} tone="primary" />
        <StatCard label="Today's Transactions" value={todayCount} icon={CalendarClock} tone="warning" />
        <StatCard label="Blockchain Verified" value={verifiedCount} icon={ShieldCheck} tone="success" />
        <StatCard label="Pending Blockchain Tx" value={pendingCount} icon={Clock} tone="danger" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Monthly Returned Items" subtitle="Items returned per month, this year" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={demoMonthlyReturns} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ct.series} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={ct.series} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={ct.grid} strokeDasharray="0" />
              <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: ct.grid }} tick={{ fill: ct.tick, fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: ct.tick, fontSize: 12 }} width={40} />
              <Tooltip content={<ChartTooltip ct={ct} unit=" items" />} cursor={{ stroke: ct.grid }} />
              <Area
                type="monotone"
                dataKey="items"
                name="Items"
                stroke={ct.series}
                strokeWidth={2}
                fill="url(#areaFill)"
                dot={{ r: 3, fill: ct.series, strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Returns by Category" subtitle={`${categoryTotal} items across ${demoByCategory.length} categories`}>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={demoByCategory}
                dataKey="value"
                nameKey="category"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
                stroke={ct.tooltipBg}
                strokeWidth={2}
                label={({ percent }) => `${Math.round(percent * 100)}%`}
                labelLine={false}
              >
                {demoByCategory.map((entry, i) => (
                  <Cell key={entry.category} fill={ct.ordinal[i % ct.ordinal.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip ct={ct} unit=" items" />} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-xs text-slate-500 dark:text-slate-400">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Returns by Office" subtitle="Total return receipts per office" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={demoByOffice} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barCategoryGap="30%">
              <CartesianGrid vertical={false} stroke={ct.grid} />
              <XAxis dataKey="office" tickLine={false} axisLine={{ stroke: ct.grid }} tick={{ fill: ct.tick, fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: ct.tick, fontSize: 12 }} width={40} />
              <Tooltip content={<ChartTooltip ct={ct} unit=" returns" />} cursor={{ fill: ct.grid, fillOpacity: 0.25 }} />
              <Bar dataKey="returns" name="Returns" fill={ct.series} radius={[4, 4, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Recent blockchain activity */}
        <ChartCard title="Recent Blockchain Activity" subtitle="Latest audited actions">
          <ul className="space-y-3">
            {demoActivity.map((a) => (
              <li key={a.id} className="flex gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Activity className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{a.action}</p>
                  <p className="truncate text-xs text-slate-400">{a.detail}</p>
                  <p className="text-[11px] text-slate-400">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </ChartCard>
      </div>

      {/* Recent returns */}
      <ChartCard title="Recent Returns" subtitle="Most recent return receipts">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                <th className="py-2 pr-4 font-semibold">Receipt No.</th>
                <th className="py-2 pr-4 font-semibold">Employee</th>
                <th className="py-2 pr-4 font-semibold">Office</th>
                <th className="py-2 pr-4 font-semibold">Date</th>
                <th className="py-2 pr-4 font-semibold">Items</th>
                <th className="py-2 pr-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {demoReceipts.map((r) => (
                <tr key={r.id} className="border-b border-slate-50 last:border-0 dark:border-slate-800/60">
                  <td className="py-2.5 pr-4 font-medium text-primary">{r.receipt_number}</td>
                  <td className="py-2.5 pr-4 text-slate-700 dark:text-slate-200">{r.employee}</td>
                  <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400">{r.office}</td>
                  <td className="py-2.5 pr-4 tabular-nums text-slate-500 dark:text-slate-400">{r.return_date}</td>
                  <td className="py-2.5 pr-4 tabular-nums text-slate-500 dark:text-slate-400">{r.items}</td>
                  <td className="py-2.5 pr-4"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
