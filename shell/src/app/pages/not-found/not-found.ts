import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [
    RouterLink,
    MatButton,
    MatCard,
    MatIcon
  ],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css'
})
export class NotFound {}