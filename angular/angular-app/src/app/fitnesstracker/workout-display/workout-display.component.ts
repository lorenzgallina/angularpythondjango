import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { Exercise, ExerciseLog, Statistics, Workout, WorkoutPlan } from 'src/app/core/interfaces/fitness.interface';
import { WorkoutPlanService } from 'src/app/core/services/workoutplan.service';
import { ExerciseService } from 'src/app/core/services/exercise.service';
import { WorkoutService } from 'src/app/core/services/workout.service';
import { ExerciseLogService } from 'src/app/core/services/exerciselog.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'app-workout-display',
  templateUrl: './workout-display.component.html',
  styleUrls: ['./workout-display.component.css']
})
export class WorkoutDisplayComponent implements OnInit {
  @ViewChild('chartSection') chartSection!: ElementRef;
  @ViewChildren(MatExpansionPanel) panels!: QueryList<MatExpansionPanel>;
  workoutPlans: WorkoutPlan[] | undefined;
  selectedWorkoutPlanId: number | null = null;
  workouts: Workout[] | undefined;
  exerciseLogs: { [key: number]: ExerciseLog[] } = {};
  allExercises: Exercise[] | undefined;
  statistics!: any;
  statisticsReady = false;

  isMobile: boolean = false;

  public lineChartData: ChartDataset[] = [
    {
      data: [],
      label: 'Weight',
      fill: true,
      backgroundColor: 'rgba(255, 99, 132, 0.25)',
      borderColor: 'rgb(255, 99, 132)',
      yAxisID: 'y-axis-l',
      type: 'line'
    },
    {
      data: [],
      label: 'Time',
      fill: false,
      borderColor: 'rgb(54, 162, 235)',
      yAxisID: 'y-axis-r',
      type: 'line'
    }
  ];
  

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
      'y-axis-r': {
        position: 'right',
        title: {
          display: true,
          text: 'Time'
        }
      }
    }
  };
  
  
  public lineChartType: ChartType = 'line';
  selectedExerciseId: number | null = null;

  constructor(private exerciseService: ExerciseService,
    private workoutService: WorkoutService,
    private workoutPlanService: WorkoutPlanService,
    private exerciseLogService: ExerciseLogService,
    private snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.loadWorkoutPlans();
    this.getExercises();
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
        this.updateChartOptions();
      });
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
      this.workoutService.getWorkoutByWorkoutPlanID(this.selectedWorkoutPlanId!).subscribe(
        (workouts) => {
          this.workouts = workouts;
          this.statisticsReady = false;
          this.exerciseLogService.getAllExerciseLogsGroupedByWorkout(Number(this.selectedWorkoutPlanId)).subscribe(
            (groupedExerciseLogs) => {
              this.exerciseLogs = groupedExerciseLogs;
              this.statistics = this.calculateStatistics();
              this.snackBar.open('Workouts Loaded!', 'Close', { duration: 3000 });
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
    this.scrollToChart()
  }

  calculateDifference(actual: number, defaultValue: number): string {
    const defaultVal = defaultValue ?? 0;
    const difference = actual - defaultVal;
    return difference >= 0 ? `+${difference}` : `${difference}`;
  }
  

  onExerciseSelected() {
    this.lineChartData[0].data = [];
    this.lineChartData[1].data = [];
    this.lineChartLabels = [];

    this.workouts?.forEach(workout => {
      if (typeof workout.id === 'number') {
        const exerciseLogsForWorkout = this.exerciseLogs[workout.id];
        if (exerciseLogsForWorkout) {
          const exerciseLog = exerciseLogsForWorkout.find(log => log.exercise === Number(this.selectedExerciseId));
          if (exerciseLog) {
            this.lineChartData[0].data.push(exerciseLog.weight);
            this.lineChartData[1].data.push(exerciseLog.time ? exerciseLog.time : 0);
            this.lineChartLabels.push(workout.date);
          }
        }
      }
    });
  }

  scrollToChart(): void {
    this.chartSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  closeAllPanels(): void {
    this.panels.forEach(panel => panel.close());
  }

  openAllPanels(): void {
    this.panels.forEach(panel => panel.open());
  }

  updateChartOptions() {
    this.lineChartOptions= {
      responsive: true,
      scales: {
        x: {
          ticks: {
            callback: (value, index, values) => {
              const date = new Date(this.lineChartLabels[index]);
              if (!isNaN(date.getTime())) {
                return date.toLocaleDateString('en-GB', {
                  month: 'numeric', 
                  day: 'numeric'
                });
              } else {
                return '';
              }
            }
          }
        },
        'y-axis-l': {
          position: 'left',
          title: {
            display: true,
            text: 'Weight [kg]'
          }
        },
        'y-axis-r': {
          position: 'right',
          title: {
            display: true,
            text: 'Time [s]'
          }
        }
      },
    }
  }

  calculateStatistics() {
    const exerciseStats: {[key: number]: {totalWeight: number, maxWeight: number, totalTime: number, maxTime: number, totalSets: number, maxSets: number, totalReps: number, maxReps: number, count: number}} = {};

    this.workouts?.forEach(workout => {
      if (typeof workout.id === 'number') {
      this.exerciseLogs[workout.id].forEach(log => {
        if (!exerciseStats[log.exercise]) {
          exerciseStats[log.exercise] = { totalWeight: 0, maxWeight:0, totalTime: 0, maxTime: 0, totalSets: 0, maxSets: 0, totalReps: 0, maxReps: 0, count: 0 };
        }
        exerciseStats[log.exercise].totalWeight += Number(log.weight);
        exerciseStats[log.exercise].totalTime += Number(log.time) ?? 0;
        exerciseStats[log.exercise].totalSets += Number(log.sets);
        exerciseStats[log.exercise].totalReps += Number(log.reps);
        if (log.weight > exerciseStats[log.exercise].maxWeight) {
          exerciseStats[log.exercise].maxWeight = Number(log.weight);
        }
        if (log.time && log.time > exerciseStats[log.exercise].maxTime) {
          exerciseStats[log.exercise].maxTime = Number(log.time);
        }
        if (log.sets > exerciseStats[log.exercise].maxSets) {
          exerciseStats[log.exercise].maxSets = Number(log.sets);
        }
        if (log.reps > exerciseStats[log.exercise].maxReps) {
          exerciseStats[log.exercise].maxReps = Number(log.reps);
        }
        exerciseStats[log.exercise].count++;
      });
      }
    });
  
    const statistics: Statistics = {};
    for (const [exerciseId, stats] of Object.entries(exerciseStats)) {
      statistics[Number(exerciseId)] = {
        maxTime: Math.round(stats.maxTime),
        maxWeight: Math.round(stats.maxWeight),
        maxSets: Math.round(stats.maxSets),
        maxReps: Math.round(stats.maxReps),
        avgWeight: Math.round(stats.totalWeight / stats.count),
        avgTime: Math.round(stats.totalTime / stats.count),
        avgSets: Math.round(stats.totalSets / stats.count),
        avgReps: Math.round(stats.totalReps / stats.count)
      };
    }
    this.statisticsReady = true;
  
    return statistics;
  }

  get statisticsExerciseIds(): number[] {
    return Object.keys(this.statistics).map(Number);
  }

}
