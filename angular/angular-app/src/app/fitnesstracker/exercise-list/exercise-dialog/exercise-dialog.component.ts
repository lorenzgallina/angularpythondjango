import { Component, Inject, Optional } from '@angular/core';
import { ApiService } from '../../fitness.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Exercise } from '../../interfaces';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise-dialog.component.html',
  styleUrls: ['./exercise-dialog.component.css']
})

export class ExerciseComponent {
  exerciseForm: FormGroup;
  isEditing = false;

  constructor(
    private formBuilder: FormBuilder, 
    private apiService: ApiService, 
    public dialogRef: MatDialogRef<ExerciseComponent>, 
    @Optional() @Inject(MAT_DIALOG_DATA) public data: {exercise: Exercise},
    private snackBar: MatSnackBar) {
    this.exerciseForm = this.formBuilder.group({
      id: '',
      name: '',
      default_weight: '',
      default_sets: '',
      default_reps: '',
    });

    if (data && data.exercise) {
      this.isEditing = true;
      this.exerciseForm.patchValue(data.exercise);
    }
  }

  addExercise() {
    const ex = this.exerciseForm.value;

    this.apiService.addExercise(this.exerciseForm.value).subscribe(
      response => {
        this.snackBar.open('Exercise added successfully!', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error => {
        this.snackBar.open('Error adding exercise.', 'Close', { duration: 3000 });
        console.error('Error adding exercise:', error);
      }
    );
  }

  updateExercise() {
    this.apiService.updateExercise(this.exerciseForm.value).subscribe(
      response => {
        this.snackBar.open('Exercise updated successfully!', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error => {
        this.snackBar.open('Error updating exercise.', 'Close', { duration: 3000 });
        console.error('Error updating exercise:', error);
      }
    );
  }

  deleteExercise() {
    if (this.data && this.data.exercise) {
      this.apiService.deleteExercise(this.data.exercise.id).subscribe(
        response => {
          this.snackBar.open('Exercise deleted successfully!', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error => {
          this.snackBar.open('Error deleting exercise.', 'Close', { duration: 3000 });
          console.error('Error deleting exercise:', error);
        }
      );
    }
  }
}