import { useState, useRef, useEffect } from 'react';
import { Todo, Priority } from '../types';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  isDragging?: boolean;
  isDragOver?: boolean;
  onDragStart?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: () => void;
  onDragEnd?: () => void;
}

const PRIORITY_CONFIG: Record<Priority, {
  label: string;
  badge: string;
  strip: string;
  glow: string;
}> = {
  high: {
    label: '高',
    badge: 'text-red-400 bg-red-400/10 border-red-400/20',
    strip: 'bg-red-400',
    glow:  'shadow-[0_0_12px_rgba(248,113,113,0.3)]',
  },
  medium: {
    label: '中',
    badge: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    strip: 'bg-amber-400',
    glow:  'shadow-[0_0_12px_rgba(251,191,36,0.3)]',
  },
  low: {
    label: '低',
    badge: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    strip: 'bg-emerald-400',
    glow:  'shadow-[0_0_12px_rgba(52,211,153,0.3)]',
  },
};

function isOverdue(dueDate: string, completed: boolean): boolean {
  if (!dueDate || completed) return false;
  return new Date(dueDate + 'T23:59:59') < new Date();
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (date.toDateString() === now.toDateString()) return '今日';
  if (date.toDateString() === tomorrow.toDateString()) return '明日';
  return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
}

export default function TodoItem({
  todo, onToggle, onDelete, onUpdate,
  isDragging, isDragOver, onDragStart, onDragOver, onDrop, onDragEnd,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [expanded, setExpanded] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) editRef.current?.select();
  }, [editing]);

  const handleEditSubmit = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== todo.title) {
      onUpdate(todo.id, { title: trimmed });
    } else {
      setEditTitle(todo.title);
    }
    setEditing(false);
  };

  const handleDelete = () => {
    setIsRemoving(true);
    setTimeout(() => onDelete(todo.id), 280);
  };

  const overdue = isOverdue(todo.dueDate, todo.completed);
  const p = PRIORITY_CONFIG[todo.priority];

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 select-none
        bg-white/[0.04] backdrop-blur-xl border
        ${isRemoving
          ? 'opacity-0 scale-[0.97] -translate-x-1'
          : isDragging
          ? 'opacity-30 scale-[0.97] cursor-grabbing'
          : isDragOver
          ? 'border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.15)] scale-[1.01]'
          : todo.completed
          ? 'border-white/[0.04]'
          : 'border-white/[0.07] hover:border-white/[0.13] hover:bg-white/[0.06] hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)]'
        }`}
    >
      {/* Priority color strip */}
      {!todo.completed && (
        <div className={`absolute left-0 top-3 bottom-3 w-[2px] rounded-full ${p.strip} opacity-80`} />
      )}

      <div className="flex items-start px-4 py-3.5 gap-3 pl-5">
        {/* Drag handle */}
        <div className="flex-shrink-0 mt-0.5 cursor-grab opacity-0 group-hover:opacity-30 hover:!opacity-60 transition-opacity">
          <svg className="w-2.5 h-4 text-white/60" viewBox="0 0 10 16" fill="currentColor">
            <circle cx="3" cy="3.5"  r="1.3" />
            <circle cx="7" cy="3.5"  r="1.3" />
            <circle cx="3" cy="8"    r="1.3" />
            <circle cx="7" cy="8"    r="1.3" />
            <circle cx="3" cy="12.5" r="1.3" />
            <circle cx="7" cy="12.5" r="1.3" />
          </svg>
        </div>

        {/* Checkbox */}
        <button
          onClick={() => onToggle(todo.id)}
          className={`mt-0.5 w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
            todo.completed
              ? `bg-indigo-500 border-indigo-500 ${p.glow}`
              : 'border-white/20 hover:border-indigo-400/60 hover:bg-indigo-400/10'
          }`}
        >
          {todo.completed && (
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              ref={editRef}
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              onBlur={handleEditSubmit}
              onKeyDown={e => {
                if (e.key === 'Enter')  { e.preventDefault(); handleEditSubmit(); }
                if (e.key === 'Escape') { setEditTitle(todo.title); setEditing(false); }
              }}
              className="w-full text-[15px] text-white/90 font-medium outline-none border-b border-indigo-400/60 bg-transparent pb-0.5"
            />
          ) : (
            <p
              onDoubleClick={() => !todo.completed && setEditing(true)}
              title={!todo.completed ? 'ダブルクリックで編集' : undefined}
              className={`text-[15px] font-medium break-words leading-snug ${
                todo.completed ? 'line-through text-white/20' : 'text-white/85 cursor-text'
              }`}
            >
              {todo.title}
            </p>
          )}

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`text-[11px] px-1.5 py-0.5 rounded border font-semibold ${p.badge}`}>
              {p.label}
            </span>
            {todo.dueDate && (
              <span className={`text-[11px] font-medium flex items-center gap-1 ${
                overdue ? 'text-red-400' : 'text-white/30'
              }`}>
                {overdue && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                )}
                {formatDate(todo.dueDate)}
                {overdue && ' 期限切れ'}
              </span>
            )}
            {todo.description && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-[11px] text-white/25 hover:text-white/50 transition-colors flex items-center gap-0.5 font-medium"
              >
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                メモ
              </button>
            )}
          </div>

          {expanded && todo.description && (
            <p className="text-xs text-white/40 mt-2 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2 leading-relaxed whitespace-pre-wrap">
              {todo.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          {!todo.completed && (
            <button
              onClick={() => setEditing(true)}
              title="編集"
              className="p-1.5 text-white/20 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all rounded-lg"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          <button
            onClick={handleDelete}
            title="削除"
            className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all rounded-lg"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
