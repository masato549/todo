interface Props {
  activeCount: number;
  completedCount: number;
  total: number;
}

export default function Header({ activeCount, completedCount, total }: Props) {
  const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <div className="mb-10">
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] text-indigo-400/60 uppercase mb-2">
            My Tasks
          </p>
          <h1 className="text-5xl font-black tracking-tight text-gradient leading-none">
            TODO
          </h1>
          <p className="text-white/30 text-sm mt-2.5 font-medium">
            {total === 0
              ? 'タスクを追加して始めましょう'
              : activeCount === 0
              ? '全タスク完了！'
              : `${activeCount}件のタスクが残っています`}
          </p>
        </div>

        {total > 0 && (
          <div className="text-right">
            <span className="text-4xl font-black text-gradient-indigo leading-none">
              {progress}
              <span className="text-2xl">%</span>
            </span>
            <p className="text-white/20 text-xs mt-1 font-medium tracking-wide">完了</p>
          </div>
        )}
      </div>

      {total > 0 && (
        <div className="relative h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-violet-400 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
          {progress > 0 && (
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-400/60 to-violet-300/60 rounded-full blur-sm transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          )}
        </div>
      )}
    </div>
  );
}
