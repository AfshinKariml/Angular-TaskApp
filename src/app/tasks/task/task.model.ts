export interface Task {
  id: string;
  userId: string;
  title: string;
  summary: string;
  dueDate: string;
  completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewTaskData {
  title: string;
  summary: string;
  date: string;
}

export interface TaskFilter {
  userId?: string;
  completed?: boolean;
  search?: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}