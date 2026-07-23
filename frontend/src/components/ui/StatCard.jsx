// Dashboard statistics card. `tone` selects an accent color; `loading` shows a skeleton.
const TONES = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
};

export default function StatCard({ label, value, icon: Icon, tone = 'primary', hint, loading }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        {Icon && (
          <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${TONES[tone]}`}>
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
      {loading ? (
        <div className="skeleton mt-3 h-8 w-24" />
      ) : (
        <p className="mt-3 text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          {value}
        </p>
      )}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
