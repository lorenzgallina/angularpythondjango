import { Component, OnInit } from '@angular/core';
import { Exercise, ExerciseLog, Workout, WorkoutPlan } from '../interfaces';
import { ApiService } from '../fitness.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-workout-display',
  templateUrl: './workout-display.component.html',
  styleUrls: ['./workout-display.component.css']
})
export class WorkoutDisplayComponent implements OnInit {

  workoutPlans: WorkoutPlan[] | undefined;
  selectedWorkoutPlanId: number | undefined;
  workouts: Workout[] | undefined;
  exerciseLogs: { [key: number]: ExerciseLog[] } = {};
  allExercises: Exercise[] | undefined;

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadWorkoutPlans();
    this.getExercises();
  }

  loadWorkoutPlans() {
    this.apiService.getWorkoutPlans().subscribe(
      (workoutplans) => {
        this.workoutPlans = workoutplans;
      },
      (error) => {
        this.snackBar.open('Error loading workoutplans.', 'Close', { duration: 3000 });
        console.error('Error loading workoutplans:', error);
      }
    );
  }

  getExercises() {
    this.apiService.getExercises().subscribe(
      (exercises) => {
        this.allExercises = exercises;
      },
      (error) => {
        console.error('Error loading exercises:', error);
      }
    );
  }

  findExercise(exerciseId: number): Exercise | undefined {
    return this.allExercises?.find(exercise => exercise.id === exerciseId);
  }

  onWorkoutPlanSelected() {
    if (this.selectedWorkoutPlanId !== null) {
      this.apiService.getWorkoutByWorkoutPlanID(this.selectedWorkoutPlanId).subscribe(
        (workouts) => {
          this.workouts = workouts;
          this.apiService.getAllExerciseLogsGroupedByWorkout(this.selectedWorkoutPlanId).subscribe(
            (groupedExerciseLogs) => {
              this.exerciseLogs = groupedExerciseLogs;
              this.snackBar.open('Exercise Logs Loaded successfully!', 'Close', { duration: 3000 });
            },
            (error) => {
              this.snackBar.open('Error loading exerciseLogs.', 'Close', { duration: 3000 });
              console.error('Error loading exerciseLogs:', error);
            }
          );
        },
        (error) => {
          this.snackBar.open('Error loading workouts.', 'Close', { duration: 3000 });
          console.error('Error loading workouts:', error);
        }
      );
    }
  }

}
