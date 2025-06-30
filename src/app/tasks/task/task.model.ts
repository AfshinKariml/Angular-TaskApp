export interface Task {
  id: string;
  userId: string;
  title: string;
  summary: string;
  dueData: string;
}

export interface NewTaskData {
  title: string;
  summary: string;
  date: string;
}
