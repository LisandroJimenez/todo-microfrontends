import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatSnackBar,
  MatSnackBarModule
} from '@angular/material/snack-bar';

import { RegisterRequest } from '../../models/register-request';
import { RegisterResponse } from '../../models/register-response';
import { AuthService } from '../../services/auth.service';
import { MatIcon } from '@angular/material/icon';

const passwordsMatchValidator: ValidatorFn = (
  form: AbstractControl
): ValidationErrors | null => {
  const password = form.get('password')?.value;
  const confirmarPassword = form.get('confirmarPassword')?.value;

  return password === confirmarPassword
    ? null
    : { passwordsMismatch: true };
};

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private readonly snackBar = inject(MatSnackBar);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isLoading = signal(false);

  readonly registerForm = new FormGroup(
    {
      nombre: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3)
        ]
      }),

      correo: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.email
        ]
      }),

      password: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(8)
        ]
      }),

      confirmarPassword: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required
        ]
      })
    },
    {
      validators: passwordsMatchValidator
    }
  );

  onSubmit(): void {
    if (this.isLoading()) {
      return;
    }

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue = this.registerForm.getRawValue();

    const registerData: RegisterRequest = {
      nombre: formValue.nombre.trim(),
      correo: formValue.correo.trim().toLowerCase(),
      password: formValue.password
    };

    this.isLoading.set(true);
    this.registerForm.disable();

    this.authService
      .register(registerData)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
          this.registerForm.enable();
        })
      )
      .subscribe({
        next: (response: RegisterResponse) => {
          this.snackBar.open(
            `Cuenta creada para ${response.nombre}.`,
            'Cerrar',
            {
              duration: 3000
            }
          );

          void this.router.navigate(['/login']);
        },

        error: (error: HttpErrorResponse) => {
          const mensaje = this.getErrorMessage(error);

          this.snackBar.open(
            mensaje,
            'Cerrar',
            {
              duration: 4000
            }
          );
        }
      });
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor.';
    }

    if (error.status === 400) {
      return this.extractBackendMessage(error)
        ?? 'No fue posible registrar la cuenta.';
    }

    if (error.status >= 500) {
      return 'El servidor tuvo un error.';
    }

    return 'No fue posible registrar la cuenta.';
  }

  private extractBackendMessage(
    error: HttpErrorResponse
  ): string | null {
    const backendError: unknown = error.error;

    if (
      typeof backendError === 'object' &&
      backendError !== null &&
      'message' in backendError &&
      typeof backendError.message === 'string'
    ) {
      return backendError.message;
    }

    return null;
  }
}