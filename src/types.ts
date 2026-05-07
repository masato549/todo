export type Priority = 'high' | 'medium' | 'low';
export type FilterStatus = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  dueDate: string;
  createdAt: number;
}

export interface FilterState {
  status: FilterStatus;
  priority: Priority | 'all';
  search: string;
}
