import { useReducer, useEffect } from 'react';
import { Todo, Priority } from '../types';

type Action =
  | { type: 'ADD'; todo: Todo }
  | { type: 'TOGGLE'; id: string }
  | { type: 'DELETE'; id: string }
  | { type: 'UPDATE'; id: string; updates: Partial<Todo> }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'REORDER'; todos: Todo[] };

function reducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case 'ADD':
      return [action.todo, ...state];
    case 'TOGGLE':
      return state.map(t => t.id === action.id ? { ...t, completed: !t.completed } : t);
    case 'DELETE':
      return state.filter(t => t.id !== action.id);
    case 'UPDATE':
      return state.map(t => t.id === action.id ? { ...t, ...action.updates } : t);
    case 'CLEAR_COMPLETED':
      return state.filter(t => !t.completed);
    case 'REORDER':
      return action.todos;
    default:
      return state;
  }
}

const STORAGE_KEY = 'todos-v1';

function loadTodos(): Todo[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function useTodos() {
  const [todos, dispatch] = useReducer(reducer, undefined, loadTodos);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (title: string, description: string, priority: Priority, dueDate: string) => {
    dispatch({
      type: 'ADD',
      todo: {
        id: crypto.randomUUID(),
        title,
        description,
        completed: false,
        priority,
        dueDate,
        createdAt: Date.now(),
      },
    });
  };

  const toggleTodo = (id: string) => dispatch({ type: 'TOGGLE', id });
  const deleteTodo = (id: string) => dispatch({ type: 'DELETE', id });
  const updateTodo = (id: string, updates: Partial<Todo>) => dispatch({ type: 'UPDATE', id, updates });
  const clearCompleted = () => dispatch({ type: 'CLEAR_COMPLETED' });
  const reorderTodos = (todos: Todo[]) => dispatch({ type: 'REORDER', todos });

  return { todos, addTodo, toggleTodo, deleteTodo, updateTodo, clearCompleted, reorderTodos };
}
