import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatSnackBar,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteDialog } from '../../dialogs/confirm-delete-dialog/confirm-delete-dialog';
import { Todo } from '../../models/todo';
import { TodosService } from '../../services/todos.service';
import { CreateTodoRequest } from '../../models/create-todo-request';
import { UpdateTodoRequest } from '../../models/update-todo-request';
import { finalize } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './todos.html',
  styleUrl: './todos.css'
})
export class Todos implements OnInit {

  private readonly todosService = inject(TodosService);
  private snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);
  readonly todos = signal<Todo[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly creating = signal(false);
  readonly updating = signal(false);
  readonly editingTodoId = signal<string | null>(null);

  readonly todoForm = new FormGroup({
    titulo: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),
    descripcion: new FormControl('', {
      nonNullable: true
    })
  })

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.loading.set(true);
    this.error.set(null);

    this.todosService.getTodos().subscribe({
      next: (todos) => {
        this.todos.set(todos);
        this.loading.set(false);

        console.log('Tareas recibidas:', todos);
      },

      error: (error) => {
        console.error('Error obteniendo tareas:', error);

        this.error.set('No se pudieron cargar las tareas.');
        this.loading.set(false);
      }
    });
  }

  createTodo(): void {
    if (this.creating()) {
      return;
    }

    if (this.todoForm.invalid) {
      this.todoForm.markAllAsTouched();
      return;
    }

    const formValue = this.todoForm.getRawValue();

    const data: CreateTodoRequest = {
      titulo: formValue.titulo.trim(),
      descripcion: formValue.descripcion.trim() || undefined
    };

    this.creating.set(true);

    this.todosService
      .createTodo(data)
      .pipe(
        finalize(() => {
          this.creating.set(false);
        })
      )
      .subscribe({
        next: (newTodo) => {
          this.snackBar.open(
            'Tarea Creada con exito.',
            'Cerrar',
            {
              duration: 3000
            }
          );
          this.todos.update((currentTodos) => [
            newTodo,
            ...currentTodos
          ]);

          this.todoForm.reset({
            titulo: '',
            descripcion: ''
          });
        },

        error: (error) => {
          console.error('Error creando tarea:', error);
          this.error.set('No se pudo crear la tarea.');
        }
      });
  }

  startEdit(todo: Todo): void {
    this.editingTodoId.set(todo.id);

    this.todoForm.patchValue({
      titulo: todo.titulo,
      descripcion: todo.descripcion ?? ''
    });
  }
  cancelEdit(): void {
    this.editingTodoId.set(null);

    this.todoForm.reset({
      titulo: '',
      descripcion: ''
    });
  }




  confirmDeleteTodo(todo: Todo): void {
    console.log('DELETE TODOOO', todo);
    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {
      data: todo
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteTodo(todo);
      }
    });
  }

  deleteTodo(todo: Todo): void {
    this.todosService.deleteTodo(todo.id).subscribe({
      next: () => {
        this.snackBar.open(
          'Tarea eliminada correctamente.',
          'Cerrar',
          {
            duration: 3000
          }
        );
        this.todos.update((currentTodos) =>
          currentTodos.filter((t) => t.id !== todo.id)
        );
      },
      error: (error) => {
        console.error('Error eliminando tarea:', error);
        this.error.set('No se pudo eliminar la tarea.');
      }
    });
  }

  saveTodo(): void {
    if (this.editingTodoId()) {
      this.updateTodo();
    } else {
      this.createTodo();
    }
  }

  updateTodo(): void {
    const todoId = this.editingTodoId();

    if (!todoId) {
      return;
    }

    if (this.updating()) {
      return;
    }

    if (this.todoForm.invalid) {
      this.todoForm.markAllAsTouched();
      return;
    }

    const currentTodo = this.todos().find(
      (todo) => todo.id === todoId
    );

    if (!currentTodo) {
      this.error.set('No se encontró la tarea que deseas editar.');
      return;
    }

    const formValue = this.todoForm.getRawValue();

    const data: UpdateTodoRequest = {
      titulo: formValue.titulo.trim(),
      descripcion: formValue.descripcion.trim() || undefined,
      completado: currentTodo.completado
    };

    this.updating.set(true);
    this.error.set(null);

    this.todosService
      .updateTodo(todoId, data)
      .pipe(
        finalize(() => {
          this.updating.set(false);
        })
      )
      .subscribe({
        next: (updatedTodo) => {
          this.todos.update((currentTodos) =>
            currentTodos.map((todo) =>
              todo.id === updatedTodo.id
                ? updatedTodo
                : todo
            )

          );
          this.snackBar.open(
            'Tarea Actualizada Correctamente.',
            'Cerrar',
            {
              duration: 3000
            }
          );

          this.cancelEdit();

          console.log('Tarea actualizada:', updatedTodo);
        },

        error: (error) => {
          console.error('Error actualizando tarea:', error);
          this.error.set('No se pudo actualizar la tarea.');
        }
      });
  }

  toggleCompleted(todo: Todo): void {
    const newCompletedStatus = !todo.completado;
    console.log('estado actual: ', todo.completado, 'Estado nuevo', newCompletedStatus);

    const data: UpdateTodoRequest = {
      titulo: todo.titulo,
      descripcion: todo.descripcion,
      completado: newCompletedStatus
    };
    this.todosService.updateTodo(todo.id, data).subscribe({
      next: (updatedTodo) => {
        this.todos.update((currentTodos) =>
            currentTodos.map((todo) =>
              todo.id === updatedTodo.id
                ? updatedTodo
                : todo
            )

          );
          this.snackBar.open(
            'Tarea Actualizada Correctamente.',
            'Cerrar',
            {
              duration: 3000
            }
          );

      },
      error: (error) => {
        console.error('Error actualizando estado:', error);
      }
    });

  }
}