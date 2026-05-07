import { FilterState, FilterStatus, Priority } from '../types';

interface Props {
  filter: FilterState;
  onChange: (filter: FilterState) => void;
  hasCompleted: boolean;
  onClearCompleted: () => void;
  total: number;
  filtered: number;
}

const STATUS_TABS: { value: FilterStatus; label: string }[] = [
  { value: 'all',       label: 'すべて' },
  { value: 'active',    label: '未完了' },
  { value: 'completed', label: '完了'   },
];

const PRIORITY_FILTERS: { value: Priority | 'all'; label: string; color?: string }[] = [
  { value: 'all',    label: 'すべて' },
  { value: 'high',   label: '高', color: 'bg-red-400'     },
  { value: 'medium', label: '中', color: 'bg-amber-400'   },
  { value: 'low',    label: '低', color: 'bg-emerald-400' },
];

export default function FilterBar({ filter, onChange, hasCompleted, onClearCompleted, total, filtered }: Props) {
  return (
    <div className="space-y-2.5 mb-5">
      <div className="flex flex-wrap items-center gap-2">
        {/* Status tabs */}
        <div className="flex glass rounded-xl p-1 gap-0.5">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => onChange({ ...filter, status: tab.value })}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-150 ${
                filter.status === tab.value
                  ? 'bg-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.35)]'
                  : 'text-white/30 hover:text-white/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 min-w-36 relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={filter.search}
            onChange={e => onChange({ ...filter, search: e.target.value })}
            placeholder="検索..."
            className="w-full glass rounded-xl pl-8 pr-3 py-1.5 text-sm text-white/70 placeholder-white/20
              outline-none focus:border-indigo-500/40 transition-colors"
          />
        </div>

        {hasCompleted && (
          <button
            onClick={onClearCompleted}
            className="text-xs text-white/25 hover:text-red-400/80 transition-colors whitespace-nowrap font-medium"
          >
            完了をクリア
          </button>
        )}
      </div>

      {/* Priority filter */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-white/20 font-semibold tracking-wider uppercase">優先度</span>
        {PRIORITY_FILTERS.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange({ ...filter, priority: opt.value })}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs border font-medium transition-all duration-150 ${
              filter.priority === opt.value
                ? 'bg-white/10 text-white/80 border-white/20'
                : 'text-white/25 border-white/[0.06] hover:border-white/15 hover:text-white/45'
            }`}
          >
            {opt.color && <span className={`w-1.5 h-1.5 rounded-full ${opt.color}`} />}
            {opt.label}
          </button>
        ))}
        {(filter.search || filter.priority !== 'all') && (
          <span className="text-[11px] text-white/20 ml-1 font-medium">{filtered}/{total}件</span>
        )}
      </div>
    </div>
  );
}
