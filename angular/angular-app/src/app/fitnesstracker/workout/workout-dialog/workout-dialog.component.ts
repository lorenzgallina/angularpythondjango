import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-workout-dialog',
  templateUrl: './workout-dialog.component.html',
  styleUrls: ['./workout-dialog.component.css']
})
export class WorkoutDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

}
