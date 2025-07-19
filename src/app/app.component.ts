import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { UserComponent } from './user/user.component';
import { TasksComponent } from './tasks/tasks.component';
import { User } from './user/user.model';
import { UserService } from './user/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, UserComponent, TasksComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit{
  users: User[] = [];
  selectedUserId?:string;

  constructor(private userService:UserService){}

  ngOnInit(){
      this.loadUsers();
  }

  loadUsers(){
    this.userService.getAllUsers().subscribe({
      next:(users)=>{
        this.users=users;
      },
      error:(error)=>{
        console.error('Error loading users:', error);
      }
    })
  }

  get selectedUser() {
    return this.users.find((user) =>  user.id === this.selectedUserId);
  }

  onSelectUser(id: string) {
    this.selectedUserId = id;
  }
}
