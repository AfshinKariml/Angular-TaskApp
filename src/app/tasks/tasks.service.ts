import { Injectable } from '@angular/core';
import { Task, type NewTaskData } from './task/task.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  getAllTask(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getUserTasks(userId: string): Observable<Task[]> {
    console.log('Fetching tasks for user:', userId);
    return this.http.get<Task[]>(`${this.apiUrl}?userId=${userId}`).pipe(
      tap(tasks => console.log('Retrieved tasks:', tasks)),
      catchError(this.handleError)
    );
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  addTask(taskData: NewTaskData, userId: string): Observable<Task> {
    const newTask = {
      userId: userId,
      title: taskData.title,
      summary: taskData.summary,
      dueDate: taskData.date,
      completed: false
    };
    
    console.log('Adding task:', newTask);
    
    return this.http.post<Task>(this.apiUrl, newTask).pipe(
      tap(createdTask => console.log('Task created:', createdTask)),
      catchError(this.handleError)
    );
  }

  updateTask(id: string, taskData: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, taskData).pipe(
      catchError(this.handleError)
    );
  }

  removeTask(id: string): Observable<void> {
    console.log('Removing task:', id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log('Task removed successfully:', id)),
      catchError(this.handleError)
    );
  }

  markTaskAsCompleted(id: string): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, { completed: true }).pipe(
      catchError(this.handleError)
    );
  }

  getTasksByStatus(completed: boolean): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}?completed=${completed}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}