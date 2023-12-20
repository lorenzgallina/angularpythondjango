import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Exercise } from 'src/app/core/interfaces/fitness.interface';
import { ExerciseService } from 'src/app/core/services/exercise.service';

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
    private exerciseService: ExerciseService, 
    public dialogRef: MatDialogRef<ExerciseComponent>, 
    @Optional() @Inject(MAT_DIALOG_DATA) public data: {exercise: Exercise},
    private snackBar: MatSnackBar) {
    this.exerciseForm = this.formBuilder.group({
      id: '',
      name: ['', Validators.required],
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

    this.exerciseService.add(this.exerciseForm.value).subscribe(
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
    this.exerciseService.update(this.exerciseForm.value, this.exerciseForm.value.id).subscribe(
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
      this.exerciseService.delete(this.data.exercise.id).subscribe(
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