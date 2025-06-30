import { Injectable } from '@angular/core';
import { type NewTaskData } from './task/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks = [
    {
      id: 't1',
      userId: 'u1',
      title: 'Master Angular',
      summary:
        'Learn all the basic and advaanced features of Angular & how to apply them.',
      dueData: '2025-12-31',
    },
    {
      id: 't2',
      userId: 'u2',
      title: 'Build first protype',
      summary: 'build a first protype of online shop website',
      dueData: '2025-5-31',
    },
    {
      id: 't3',
      userId: 'u3',
      title: 'prepare issu template',
      summary:
        'prepare and describe an issue template wich will help with project managment',
      dueData: '2025-6-15',
    },
  ];

  constructor() {
    const tasks = localStorage.getItem('tasks');

    if (tasks) {
      this.tasks = JSON.parse(tasks);
    }
  }

  getUserTasks(userId: string) {
    return this.tasks.filter((task) => task.userId === userId);
  }

  addTask(taskData: NewTaskData, userId: string) {
    this.tasks.unshift({
      userId: userId,
      id: new Date().getTime().toString(),
      title: taskData.title,
      summary: taskData.summary,
      dueData: taskData.date,
    });
    this.SaveTask();
  }

  removeTask(id: string) {
    return (this.tasks = this.tasks.filter((task) => task.id !== id));
    this.SaveTask();
  }

  private SaveTask() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
}
