import { useState } from 'react';
import { Todo } from '../types';
import TodoItem from './TodoItem';

interface Props {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onReorder: (sourceId: string, targetId: string) => void;
  isFiltered: boolean;
}

export default function TodoList({ todos, onToggle, onDelete, onUpdate, onReorder, isFiltered }: Props) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDragStart = (id: string) => setDraggingId(id);
  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (id !== draggingId) setDragOverId(id);
  };
  const handleDrop = (targetId: string) => {
    if (draggingId && draggingId !== targetId) onReorder(draggingId, targetId);
    setDraggingId(null);
    setDragOverId(null);
  };
  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverId(null);
  };

  if (todos.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl glass flex items-center justify-center">
          <svg className="w-7 h-7 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <p className="text-white/30 font-semibold">
          {isFiltered ? '条件に合うタスクがありません' : 'タスクがありません'}
        </p>
        <p className="text-white/15 text-sm mt-1.5">
          {isFiltered ? 'フィルターを変更してみてください' : '上のフォームから追加しましょう'}
        </p>
      </div>
    );
  }

  const active    = todos.filter(t => !t.completed);
  const completed = todos.filter(t =>  t.completed);

  const renderItem = (todo: Todo) => (
    <TodoItem
      key={todo.id}
      todo={todo}
      onToggle={onToggle}
      onDelete={onDelete}
      onUpdate={onUpdate}
      isDragging={draggingId === todo.id}
      isDragOver={dragOverId === todo.id}
      onDragStart={() => handleDragStart(todo.id)}
      onDragOver={e => handleDragOver(e, todo.id)}
      onDrop={() => handleDrop(todo.id)}
      onDragEnd={handleDragEnd}
    />
  );

  return (
    <div className="space-y-2">
      {active.map(renderItem)}

      {active.length > 0 && completed.length > 0 && (
        <div className="flex items-center gap-3 py-3 px-1">
          <div className="flex-1 h-px bg-white/[0.05]" />
          <span className="text-[11px] text-white/20 font-semibold tracking-wider uppercase whitespace-nowrap">
            完了 {completed.length}件
          </span>
          <div className="flex-1 h-px bg-white/[0.05]" />
        </div>
      )}

      {completed.map(renderItem)}
    </div>
  );
}
