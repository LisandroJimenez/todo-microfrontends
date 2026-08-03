import { Component, inject, output } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [MatToolbar, MatIcon, MatIconButton],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  protected menuToggle = output<void>();
  private readonly router = inject(Router);

  protected onMenuToggle(): void{
    this.menuToggle.emit();
  }

  logout(): void{
    sessionStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }
}
