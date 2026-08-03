import {
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatSnackBar,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginRequest } from '../../models/login-request';
import { LoginResponse } from '../../models/login-response';
import { finalize } from 'rxjs';
import { TokenStorageService } from '../../services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private readonly authService = inject(AuthService);
  private readonly tokenStorageService = inject(TokenStorageService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  readonly isLoading = signal(false);

  readonly loginForm = new FormGroup({
    correo: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email,
      ],
    }),

    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(6),
      ],
    }),
  });

  onSubmit(): void {
    if (this.isLoading()) {
      return;
    }

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const formValue = this.loginForm.getRawValue();

    const credentials: LoginRequest = {
      username: formValue.correo ?? '',
      password: formValue.password ?? ''
    };

    this.isLoading.set(true);
    this.loginForm.disable();

    this.authService
      .login(credentials)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
          this.loginForm.enable();
        })
      )
      .subscribe({
        next: (response: LoginResponse) => {
          this.tokenStorageService.saveToken(response.access_token);

          this.snackBar.open(
            'Inicio de sesión correcto.',
            'Cerrar',
            {
              duration: 3000
            }
          );

          this.router.navigate(['/todos']);
        },
        error: (error: HttpErrorResponse) => {
          let mensaje = 'No fue posible iniciar sesión.';

          if (error.status === 0) {
            mensaje = 'No se pudo conectar con el servidor.';
          } else if (error.status === 400 || error.status === 401) {
            mensaje = 'Correo o contraseña incorrectos.';
          } else if (error.status >= 500) {
            mensaje = 'El servidor tuvo un error.';
          }

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

}