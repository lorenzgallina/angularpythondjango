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
  allexercises: Exercise[] = [];
  workoutPlans: WorkoutPlan[] | undefined;
  isEditing = false;

  workoutPlanForm = this.formBuilder.group({
    id: new FormControl(0),
    name: new FormControl(''),
    exercises: this.formBuilder.array([])
  });

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<WorkoutPlanDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { workoutPlan: WorkoutPlan },
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getExercises();
  }

  get exercisesfromarray() {
    return this.workoutPlanForm.controls["exercises"] as FormArray;
  }

  getExercises() {
    this.apiService.getExercises().subscribe(
      (exercises) => {
        this.allexercises = exercises;
        exercises.forEach((exercise) => {
          const isSelected = this.data && this.data.workoutPlan && this.data.workoutPlan.exercises.includes(exercise.id);
          this.addExercise(exercise, isSelected);
        });
  
        if (this.data && this.data.workoutPlan) {
          this.isEditing = true;
          this.workoutPlanForm.patchValue({ id: this.data.workoutPlan.id, name: this.data.workoutPlan.name });
        }
      },
      (error) => {
        console.error('Error loading exercises:', error);
      }
    );
  }

  addExercise(exercise: Exercise, isSelected: boolean) {
    const exercisesForm = this.formBuilder.group({
        id: new FormControl(exercise.id),
        name: new FormControl(exercise.name),
        selected: new FormControl(isSelected)
      });
      this.exercisesfromarray.push(exercisesForm);
  }

  addWorkoutPlan() {
    const selectedExerciseIds = this.exercisesfromarray.value
      .filter((exercise: { selected: any; }) => exercise.selected)
      .map((exercise: { id: any; }) => exercise.id);
  
    const workoutPlanData = {
      name: this.workoutPlanForm.get('name')?.value || '',
      exercises: selectedExerciseIds
    };
  
    this.apiService.addWorkoutPlan(workoutPlanData).subscribe(
      response => {
        this.snackBar.open('WorkoutPlan added successfully!', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error => {
        this.snackBar.open('Error adding WorkoutPlan.', 'Close', { duration: 3000 });
        console.error('Error adding WorkoutPlan:', error);
      }
    );
  }

  updateWorkoutPlan() {
    const selectedExercises = this.exercisesfromarray.value
      .filter((exercise: { selected: any; }) => exercise.selected)
      .map((exercise: { id: any; }) => exercise.id);

    const workoutPlanData = {
      id: this.workoutPlanForm.get('id')?.value,
      name: this.workoutPlanForm.get('name')?.value,
      exercises: selectedExercises
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
