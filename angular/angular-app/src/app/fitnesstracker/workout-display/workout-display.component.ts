import { Component, OnInit } from '@angular/core';
import { ExerciseLog, Workout, WorkoutPlan } from '../interfaces';
import { ApiService } from '../fitness.service';

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

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadWorkoutPlans();
  }

  loadWorkoutPlans() {
    this.apiService.getWorkoutPlans().subscribe(
      (workoutplans) => {
        this.workoutPlans = workoutplans;
      },
      (error) => {
        console.error('Error loading workoutplans:', error);
      }
    );
  }

  onWorkoutPlanSelected() {
    if (this.selectedWorkoutPlanId !== null) {
      this.apiService.getWorkoutByWorkoutPlanID(this.selectedWorkoutPlanId).subscribe(
        (workouts) => {
          this.workouts = workouts;
          this.apiService.getAllExerciseLogsGroupedByWorkout(this.selectedWorkoutPlanId).subscribe(
            (groupedExerciseLogs) => {
              this.exerciseLogs = groupedExerciseLogs;
            },
            (error) => {
              console.error('Error loading exerciseLogs:', error);
            }
          );
        },
        (error) => {
          console.error('Error loading workouts:', error);
        }
      );
    }
  }

}
