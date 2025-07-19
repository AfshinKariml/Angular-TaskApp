import { Component,EventEmitter,inject, Input, Output } from '@angular/core';
import { type Task } from './task.model';
import { CardComponent } from '../../shared/card/card.component';
import { DatePipe } from '@angular/common';
import { TaskService } from '../tasks.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CardComponent, DatePipe],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent {
  @Input({ required: true }) task!: Task;
  @Output() taskCompleted = new EventEmitter<string>();
  private tasksService = inject(TaskService);

  onCompeteTask() {
    this.tasksService.removeTask(this.task.id).subscribe({
      next: () => {
        this.taskCompleted.emit(this.task.id);
      },
      error: (error) => {
        console.error('Error completing task:', error);
      }
    });
  }
}
