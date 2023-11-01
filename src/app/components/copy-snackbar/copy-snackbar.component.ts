import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { MaterialModule } from 'src/app/modules/material.module';

@Component({
  selector: 'app-copy-snackbar',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './copy-snackbar.component.html',
  styleUrls: ['./copy-snackbar.component.css']
})
export class CopySnackbarComponent {
  snackBarRef = inject(MatSnackBarRef);
}
