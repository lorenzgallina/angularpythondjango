import { Component, Inject, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Exercise, WorkoutPlan } from 'src/app/core/interfaces/fitness.interface';
import { ExerciseService } from 'src/app/core/services/exercise.service';
import { WorkoutPlanService } from 'src/app/core/services/workoutplan.service';

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
    id: 0,
    name: ['', Validators.required],
    exercises: this.formBuilder.array([])
  });

  constructor(
    private exerciseService: ExerciseService,
    private workoutPlanService: WorkoutPlanService,
    private formBuilder: FormBuilder,
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
    this.exerciseService.getAll().subscribe(
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
        id: exercise.id,
        name: exercise.name,
        selected: isSelected
      });
      this.exercisesfromarray.push(exercisesForm);
  }

  addWorkoutPlan() {
    const selectedExerciseIds = this.exercisesfromarray.value
      .filter((exercise: { selected: any; }) => exercise.selected)
      .map((exercise: { id: any; }) => exercise.id);
  
    const workoutPlanData: WorkoutPlan = {
      name: this.workoutPlanForm.get('name')?.value || '',
      exercises: selectedExerciseIds
    };
  
    this.workoutPlanService.add(workoutPlanData).subscribe(
      response => {
        this.snackBar.open('Workout added successfully!', 'Close', { duration: 3000 });
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

    const workoutPlanData: WorkoutPlan = {
      id: Number(this.workoutPlanForm.get('id')?.value),
      name: this.workoutPlanForm.get('name')?.value!,
      exercises: selectedExercises
    };

    this.workoutPlanService.update(workoutPlanData, workoutPlanData.id!).subscribe(
      response => {
        this.snackBar.open('Workoutupdated successfully!', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error => {
        this.snackBar.open('Error updating Workout', 'Close', { duration: 3000 });
        console.error('Error updating WorkoutPlan:', error);
      }
    );
  }

  deleteWorkoutPlan() {
    if (this.data && this.data.workoutPlan) {
      this.workoutPlanService.delete(this.data.workoutPlan.id!).subscribe(
        response => {
          this.snackBar.open('Workout deleted successfully!', 'Close', { duration: 3000 });
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
