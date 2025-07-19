import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, inject } from '@angular/core';
import { TaskComponent } from './task/task.component';
import { NewTaskComponent } from './new-task/new-task.component';
import { Task, type NewTaskData } from './task/task.model';
import { TaskService } from './tasks.service';
import { CommonModule } from '@angular/common';
import { catchError, Observable, of, BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TaskComponent, NewTaskComponent, CommonModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit, OnDestroy, OnChanges {
  @Input({ required: true }) userId!: string;
  @Input({ required: true }) name?: string;

  isAddingTask = false;
  error: string | null = null;
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private subscription?: Subscription;
  private currentUserId: string = '';

  private tasksService = inject(TaskService);

  ngOnInit() {
    this.currentUserId = this.userId;
    this.loadTasks();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userId'] && !changes['userId'].firstChange) {
      this.currentUserId = this.userId;
      this.clearAndReload();
    }
  }

  ngOnDestroy() {
    this.cleanup();
  }

  get selectedUserTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  private clearAndReload() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.tasksSubject.next([]);
    this.isAddingTask = false;
    this.error = null;
    this.loadTasks();
  }

  loadTasks() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    
    this.subscription = this.tasksService.getUserTasks(this.userId).pipe(
      catchError(error => {
        this.error = 'Failed to load tasks';
        return of([]);
      })
    ).subscribe({
      next: (tasks) => {
        const userTasks = tasks.filter(task => task.userId === this.userId);
        this.tasksSubject.next(userTasks);
        this.error = null;
      },
      error: (error) => {
        this.error = 'Failed to load tasks';
        this.tasksSubject.next([]);
      }
    });
  }

  onStartAddTask() {
    this.isAddingTask = true;
  }

  onCloseAddTask() {
    this.isAddingTask = false;
  }
  
  onTaskAdded(newTask: Task) {
    if (newTask.userId === this.userId) {
      const currentTasks = this.tasksSubject.getValue();
      this.tasksSubject.next([newTask, ...currentTasks]);
    }
    
    this.isAddingTask = false;
  }

  onTaskCompleted(taskId: string) {
    const currentTasks = this.tasksSubject.getValue();
    const updatedTasks = currentTasks.filter(task => task.id !== taskId);
    this.tasksSubject.next(updatedTasks);
  }

  private cleanup() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.tasksSubject.complete();
  }
}