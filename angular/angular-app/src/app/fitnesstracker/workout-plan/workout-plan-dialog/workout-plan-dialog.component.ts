import { Component, Inject, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Exercise, WorkoutPlan } from '../../interfaces';
import { ApiService } from '../../fitness.service';

@Component({
  selector: 'app-workout-plan-dialog',
  templateUrl: './workout-plan-dialog.component.html',
  styleUrls: ['./workout-plan-dialog.component.css']
})
export class WorkoutPlanDialogComponent {
  workoutPlanForm: FormGroup;
  exercises: Exercise[] | undefined;
  workoutPlans: WorkoutPlan[] | undefined;
  isEditing = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<WorkoutPlanDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { workoutPlan: WorkoutPlan },
    private snackBar: MatSnackBar
  ) {
    this.workoutPlanForm = this.formBuilder.group({
      id: '',
      name: '',
      exercises: this.formBuilder.array([])
    });

    this.getExercises();
  }

  ngOnInit() {
    this.getExercises();
  }

  getExercises() {
    this.apiService.getExercises().subscribe(
      (exercises) => {
        this.exercises = exercises;
        if (this.data && this.data.workoutPlan) {
          this.isEditing = true;
          this.workoutPlanForm.patchValue(this.data.workoutPlan);
  
          // Populate the form array with the exercise IDs
          const exercisesFormArray = this.workoutPlanForm.get('exercises') as FormArray;
          this.data.workoutPlan.exercises.forEach((exerciseId: any) => {
            exercisesFormArray.push(new FormControl(exerciseId));
          });
        }
      },
      (error) => {
        console.error('Error loading exercises:', error);
      }
    );
  }

  onExerciseChange(exerciseId: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const exercisesFormArray = this.workoutPlanForm.get('exercises') as FormArray;
  
    if (isChecked) {
      exercisesFormArray.push(new FormControl(exerciseId));
    } else {
      const index = exercisesFormArray.controls.findIndex(x => x.value === exerciseId);
      exercisesFormArray.removeAt(index);
    }
  }

  isExerciseSelected(exerciseId: number): boolean {
    const exercisesFormArray = this.workoutPlanForm.get('exercises') as FormArray;
    return exercisesFormArray.value.includes(exerciseId);
  }

  addWorkoutPlan() {
    const workoutPlanData = {
      ...this.workoutPlanForm.value,
      exercises: this.workoutPlanForm.value.exercises
    };

    this.apiService.addWorkoutPlan(workoutPlanData).subscribe(
      response => {
        this.snackBar.open('WorkoutPlan updated successfully!', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error => {
        this.snackBar.open('Error updating WorkoutPlan.', 'Close', { duration: 3000 });
        console.error('Error updating WorkoutPlan:', error);
      }
    );
  }

  updateWorkoutPlan() {
    const workoutPlanData = {
      ...this.workoutPlanForm.value,
      exercises: this.workoutPlanForm.value.exercises
    };
    this.apiService.updateWorkoutPlan(workoutPlanData).subscribe(
      response => {
        this.snackBar.open('WorkoutPlan updated successfully!', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error => {
        this.snackBar.open('Error updating WorkoutPlan.', 'Close', { duration: 3000 });
        console.error('Error updating WorkoutPlan:', error);
      }
    );
  }

  deleteWorkoutPlan() {
    if (this.data && this.data.workoutPlan) {
      this.apiService.deleteWorkoutPlan(this.data.workoutPlan.id).subscribe(
        response => {
          this.snackBar.open('WorkoutPlan deleted successfully!', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error => {
          this.snackBar.open('Error deleting WorkoutPlan.', 'Close', { duration: 3000 });
          console.error('Error deleting WorkoutPlan:', error);
        }
      );
    }
  }

}
