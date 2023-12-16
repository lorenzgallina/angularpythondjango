import { Component, OnInit } from '@angular/core';
import { Exercise, ExerciseLog, Workout, WorkoutPlan } from '../interfaces';
import { ApiService } from '../fitness.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';

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

  // chart:
  public lineChartWeightData: ChartDataset[] = [{
    data: [],
    label: 'Weight',
    fill: true,
    backgroundColor: 'rgba(255, 99, 132, 0.25)',
    borderColor: 'rgb(255, 99, 132)',
    //pointBackgroundColor: 'blue',
    //pointRadius: 5,
    //pointHoverRadius: 7,
    type: 'line'
  }];

  public lineChartRepsData: ChartDataset[] = [{
    data: [],
    label: 'Reps',
    fill: true,
    backgroundColor: 'rgba(255, 99, 132, 0.25)',
    borderColor: 'rgb(255, 99, 132)',
    //pointBackgroundColor: 'green',
    //pointRadius: 5,
    //pointHoverRadius: 7,
    type: 'line'
  }];

  public lineChartSetsData: ChartDataset[] = [{
    data: [],
    label: 'Sets',
    fill: true,
    backgroundColor: 'rgba(255, 99, 132, 0.25)',
    borderColor: 'rgb(255, 99, 132)',
    //pointBackgroundColor: 'red',
    //pointRadius: 5,
    //pointHoverRadius: 7,
    type: 'line'
  }];
  
  public lineChartLabels: string[] = [];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    // additional chart options here
  };
  public lineChartType: ChartType = 'line';
  selectedExerciseId: number | null = null;

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

  onExerciseSelected() {
    this.lineChartWeightData[0].data = [];
    this.lineChartRepsData[0].data = [];
    this.lineChartSetsData[0].data = [];
    this.lineChartLabels = [];
  
    this.workouts?.forEach(workout => {
      const exerciseLogsForWorkout = this.exerciseLogs[workout.id];
      if (exerciseLogsForWorkout) {
        const exerciseLog = exerciseLogsForWorkout.find(log => log.exercise === this.selectedExerciseId);
        if (exerciseLog) {
          this.lineChartWeightData[0].data.push(exerciseLog.weight);
          this.lineChartRepsData[0].data.push(exerciseLog.reps);
          this.lineChartSetsData[0].data.push(exerciseLog.sets);
          this.lineChartLabels.push(new Date(workout.date).toLocaleDateString());
        }
      }
    });
  
    // Update or rerender the chart if needed
  }

}
