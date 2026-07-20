type Props = {
  title: string;
  value: number | string;
  hint: string;
};

export function StatCard({ title, value, hint }: Props): React.JSX.Element {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-brand-ink">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{hint}</p>
    </div>
  );
}
