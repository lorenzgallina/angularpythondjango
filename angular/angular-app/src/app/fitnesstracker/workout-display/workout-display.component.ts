import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { Exercise, ExerciseLog, Workout, WorkoutPlan } from 'src/app/core/interfaces/fitness.interface';
import { WorkoutPlanService } from 'src/app/core/services/workoutplan.service';
import { ExerciseService } from 'src/app/core/services/exercise.service';
import { WorkoutService } from 'src/app/core/services/workout.service';
import { ExerciseLogService } from 'src/app/core/services/exerciselog.service';

@Component({
  selector: 'app-workout-display',
  templateUrl: './workout-display.component.html',
  styleUrls: ['./workout-display.component.css']
})
export class WorkoutDisplayComponent implements OnInit {

  workoutPlans: WorkoutPlan[] | undefined;
  selectedWorkoutPlanId: number | null = null;
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
    yAxisID: 'y-axis-l',
    //pointBackgroundColor: 'blue',
    //pointRadius: 5,
    //pointHoverRadius: 7,
    type: 'line'
  }];
  

  public lineChartLabels: string[] = [];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      'y-axis-l': {
        position: 'left',
        title: {
          display: true,
          text: 'Weight'
        }
      },
    }
  };
  
  
  public lineChartType: ChartType = 'line';
  selectedExerciseId: number | null = null;

  constructor(private exerciseService: ExerciseService,
    private workoutService: WorkoutService,
    private workoutPlanService: WorkoutPlanService,
    private exerciseLogService: ExerciseLogService,
    private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadWorkoutPlans();
    this.getExercises();
  }

  loadWorkoutPlans() {
    this.workoutPlanService.getAll().subscribe(
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
    this.exerciseService.getAll().subscribe(
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
      this. workoutService.getWorkoutByWorkoutPlanID(this.selectedWorkoutPlanId!).subscribe(
        (workouts) => {
          this.workouts = workouts;
          this.exerciseLogService.getAllExerciseLogsGroupedByWorkout(Number(this.selectedWorkoutPlanId)).subscribe(
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

  selectExercise(exerciseId: number, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedExerciseId = exerciseId;
    this.onExerciseSelected();
  }

  calculateDifference(actual: number, defaultValue: number): string {
    const defaultVal = defaultValue ?? 0; // Treat undefined as 0
    const difference = actual - defaultVal;
    return difference >= 0 ? `+${difference}` : `${difference}`;
  }
  

  onExerciseSelected() {
    this.lineChartWeightData[0].data = [];
    this.lineChartLabels = [];

    this.workouts?.forEach(workout => {
      if (typeof workout.id === 'number') {
        const exerciseLogsForWorkout = this.exerciseLogs[workout.id];
        if (exerciseLogsForWorkout) {
          const exerciseLog = exerciseLogsForWorkout.find(log => log.exercise === Number(this.selectedExerciseId));
          if (exerciseLog) {
            this.lineChartWeightData[0].data.push(exerciseLog.weight);
            this.lineChartLabels.push(new Date(workout.date).toLocaleDateString());
          }
        }
      }
    });
  }

}
