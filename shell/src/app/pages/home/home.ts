import { Component, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  imports: [MatButton, MatCard, MatIcon],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  protected readonly title = signal('ToDoList');

  protected changeTitle(): void {
    this.title.set('Mi aplicación de tareas');
  }
}