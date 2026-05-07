import { useState, useRef } from 'react';
import { Priority } from '../types';

interface Props {
  onAdd: (title: string, description: string, priority: Priority, dueDate: string) => void;
}

const PRIORITY_OPTIONS: { value: Priority; label: string; active: string; glow: string }[] = [
  { value: 'high',   label: '高', active: 'bg-red-500/20 text-red-400 border-red-500/40',     glow: 'shadow-red-500/20' },
  { value: 'medium', label: '中', active: 'bg-amber-500/20 text-amber-400 border-amber-500/40', glow: 'shadow-amber-500/20' },
  { value: 'low',    label: '低', active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', glow: 'shadow-emerald-500/20' },
];

export default function AddTodoForm({ onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), description.trim(), priority, dueDate);
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setExpanded(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setExpanded(false);
      setDescription('');
      setDueDate('');
      setPriority('medium');
      inputRef.current?.blur();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className={`glass rounded-2xl mb-4 overflow-hidden transition-all duration-200
        ${expanded
          ? 'border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.1)]'
          : 'hover:border-white/[0.12]'
        }`}
    >
      <div className="flex items-center px-4 py-3.5 gap-3">
        <button
          type="submit"
          aria-label="追加"
          className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all duration-200 ${
            title.trim()
              ? 'border-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.4)]'
              : 'border-white/20 hover:border-white/40'
          }`}
        />
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onFocus={() => setExpanded(true)}
          placeholder="新しいタスクを追加..."
          className="flex-1 bg-transparent text-white/90 placeholder-white/20 outline-none text-[15px] font-medium"
        />
        {title.trim() && (
          <button
            type="submit"
            className="px-3 py-1 bg-indigo-500 text-white text-sm rounded-lg font-medium
              hover:bg-indigo-400 active:scale-95 transition-all flex-shrink-0
              shadow-[0_0_14px_rgba(99,102,241,0.4)]"
          >
            追加
          </button>
        )}
      </div>

      {expanded && (
        <div className="border-t border-white/[0.06] px-4 pb-3.5 pt-3 space-y-3">
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="メモを追加（任意）"
            rows={2}
            className="w-full bg-transparent text-sm text-white/60 placeholder-white/20 outline-none resize-none leading-relaxed"
          />
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-white/30 font-semibold tracking-wider uppercase">優先度</span>
              {PRIORITY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(opt.value)}
                  className={`px-2.5 py-0.5 rounded-md text-xs border font-semibold transition-all duration-150 ${
                    priority === opt.value
                      ? `${opt.active} shadow-sm ${opt.glow}`
                      : 'text-white/30 border-white/10 hover:border-white/20 hover:text-white/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-white/30 font-semibold tracking-wider uppercase">期限</span>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="text-xs text-white/60 bg-white/[0.06] border border-white/10 rounded-md px-2 py-0.5
                  outline-none focus:border-indigo-500/50 transition-colors [color-scheme:dark]"
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
