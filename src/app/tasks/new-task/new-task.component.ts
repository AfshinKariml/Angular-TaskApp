import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task, type NewTaskData } from '../task/task.model';
import { TaskService } from '../tasks.service';

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css',
})
export class NewTaskComponent {
  @Input({ required: true }) userId!: string;
  @Output() close = new EventEmitter<void>();
  @Output() taskAdded = new EventEmitter<Task>();

  enteredTitle = '';
  enteredSummary = '';
  enterDate = '';
  isSubmitting = false;
  error: string | null = null;

  private tasksService = inject(TaskService);

  onCancel() {
    this.clearForm()
    this.close.emit();
  }

  onSubmit() {
    if (this.validateForm()) return;

    this.isSubmitting = true;
    
    const taskData = this.prepareTaskData();
    
    this.tasksService.addTask(taskData, this.userId).subscribe({
      next: (createdTask) => this.handleSuccess(createdTask),
      error: (err) => this.handleError(err)
    });
  }

  private validateForm(): boolean {
    if (!this.enteredTitle.trim()) {
      this.error = 'Title is required';
      return true;
    }
    
    if (!this.enteredSummary.trim()) {
      this.error = 'Summary is required';
      return true;
    }
    
    if (!this.enterDate) {
      this.error = 'Due date is required';
      return true;
    }
    
    this.error = null;
    return false;
  }

  private prepareTaskData(): NewTaskData {
    return {
      title: this.enteredTitle.trim(),
      summary: this.enteredSummary.trim(),
      date: this.enterDate
    };
  }

  private handleSuccess(createdTask: Task) {
    if (createdTask && createdTask.userId === this.userId) {
      this.taskAdded.emit(createdTask);
    } else {
      console.error('Created task userId mismatch:', createdTask);
    }
    
    this.clearForm();
    this.close.emit();
  }

  private handleError(error: any) {
    console.error('Error adding task:', error);
    this.error = 'Failed to add task. Please try again.';
    this.isSubmitting = false;
  }

  private clearForm() {
    this.enteredTitle = '';
    this.enteredSummary = '';
    this.enterDate = '';
    this.error = null;
    this.isSubmitting = false;
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}
