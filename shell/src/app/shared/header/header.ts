import { Component, output } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-header',
  imports: [MatToolbar, MatIcon, MatIconButton],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  protected menuToggle = output<void>();

  protected onMenuToggle(): void{
    this.menuToggle.emit();
  }
}
