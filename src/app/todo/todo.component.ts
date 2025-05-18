import { Component, OnInit } from '@angular/core';
import { Howl } from 'howler';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-todo',
  standalone: false,

  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
})
export class TodoComponent implements OnInit {
  tasks: {id:number, name: string; completed: boolean }[] = [];
  newtask: string = '';
  nextid: number = 1
  currenttask: any = null
  isDarkMode: boolean = false;

  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {
    const sortedtasks = localStorage.getItem("tasks")
    if(sortedtasks) {
      this.tasks = JSON.parse(sortedtasks)
      this.nextid = this.tasks.length ? Math.max(...this.tasks.map(task => task.id)) + 1 : 1
    }
  }

  addtask(): void {
    if (this.newtask.trim()) {
      if (this.currenttask) {
        this.currenttask.name = this.newtask;
        this.currenttask = null;
      } else {
        this.tasks.push({ id: this.nextid++, name: this.newtask, completed: false });
        this.toastr.success('Task added successfully!', '', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true,
          toastClass: 'toast-added ',
        });
        this.playSound('add');
      }
      this.newtask = '';
      this.saveTasks()
    }
  }


toggleComplete(id: number) {
 const taskcompleted = this.tasks.find(task => task.id === id)

 if (taskcompleted) {
  taskcompleted.completed = !taskcompleted.completed;
 }
 this.saveTasks()
}

deletetask(id: number) {
 this.tasks = this.tasks.filter(task => task.id !== id)
 this.toastr.error('Task deleted!', '', {
  timeOut: 3000,
  positionClass: 'toast-top-right',
  progressBar: true,
  toastClass: 'toast-deleted',
 });
 this.playSound('delete');
 this.saveTasks()
}

editTask(id: number): void {
  this.currenttask = this.tasks.find(task => task.id === id);
  if (this.currenttask) {
    this.newtask = this.currenttask.name;
  }
}

playSound(action: string): void {
  let soundFile = '';
  if (action === 'add') {
    soundFile = 'assets/sounds/added.mp3';
  } else if (action === 'delete') {
    soundFile = 'assets/sounds/delete.mp3';
  } else if (action === 'update') {
    soundFile = 'assets/sounds/update.mp3';
  }

  const sound = new Howl({
    src: [soundFile],
    volume: 1,
  });
  sound.play();
}

saveTasks(): void {
  localStorage.setItem('tasks', JSON.stringify(this.tasks));
}
}
