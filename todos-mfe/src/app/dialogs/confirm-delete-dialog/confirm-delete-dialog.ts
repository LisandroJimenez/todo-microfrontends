import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-confirm-delete-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirm-delete-dialog.html',
  styleUrl: './confirm-delete-dialog.css',
})
export class ConfirmDeleteDialog {}
