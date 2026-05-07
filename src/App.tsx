import { useState, useMemo } from 'react';
import { useTodos } from './hooks/useTodos';
import { FilterState } from './types';
import Header from './components/Header';
import AddTodoForm from './components/AddTodoForm';
import FilterBar from './components/FilterBar';
import TodoList from './components/TodoList';

const DEFAULT_FILTER: FilterState = {
  status: 'all',
  priority: 'all',
  search: '',
};

export default function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, updateTodo, clearCompleted, reorderTodos } = useTodos();
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter.status === 'active' && todo.completed) return false;
      if (filter.status === 'completed' && !todo.completed) return false;
      if (filter.priority !== 'all' && todo.priority !== filter.priority) return false;
      if (filter.search) {
        const q = filter.search.toLowerCase();
        if (!todo.title.toLowerCase().includes(q) && !todo.description.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [todos, filter]);

  const handleReorder = (sourceId: string, targetId: string) => {
    const next = [...todos];
    const srcIdx = next.findIndex(t => t.id === sourceId);
    const tgtIdx = next.findIndex(t => t.id === targetId);
    if (srcIdx === -1 || tgtIdx === -1) return;
    const [removed] = next.splice(srcIdx, 1);
    next.splice(tgtIdx, 0, removed);
    reorderTodos(next);
  };

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;
  const isFiltered = filter.status !== 'all' || filter.priority !== 'all' || filter.search !== '';

  return (
    <div className="min-h-screen bg-[#080c14] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-indigo-600/[0.08] blur-[120px]" />
        <div className="absolute top-[30%] left-[-5%] w-[400px] h-[400px] rounded-full bg-violet-600/[0.06] blur-[100px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[350px] h-[350px] rounded-full bg-indigo-500/[0.07] blur-[100px]" />
      </div>

      <div className="relative max-w-xl mx-auto px-4 py-12">
        <Header
          activeCount={activeCount}
          completedCount={completedCount}
          total={todos.length}
        />
        <AddTodoForm onAdd={addTodo} />
        {todos.length > 0 && (
          <FilterBar
            filter={filter}
            onChange={setFilter}
            hasCompleted={completedCount > 0}
            onClearCompleted={clearCompleted}
            total={todos.length}
            filtered={filteredTodos.length}
          />
        )}
        <TodoList
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
          onReorder={handleReorder}
          isFiltered={isFiltered}
        />
      </div>
    </div>
  );
}
