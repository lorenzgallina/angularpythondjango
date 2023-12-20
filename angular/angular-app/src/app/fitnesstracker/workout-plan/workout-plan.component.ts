import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WorkoutPlanDialogComponent } from './workout-plan-dialog/workout-plan-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Exercise, WorkoutPlan } from 'src/app/core/interfaces/fitness.interface';
import { WorkoutPlanService } from 'src/app/core/services/workoutplan.service';
import { ExerciseService } from 'src/app/core/services/exercise.service';

@Component({
  selector: 'app-workout-plan',
  templateUrl: './workout-plan.component.html',
  styleUrls: ['./workout-plan.component.css']
})
export class WorkoutPlanComponent implements OnInit {
  exercises: Exercise[] | undefined;
  workoutPlanForm: FormGroup;
  workoutPlans: WorkoutPlan[] = [];
  displayedColumns: string[] = ['id', 'name', 'actions'];

  constructor(
    private exerciseService: ExerciseService,
    private workoutPlanService: WorkoutPlanService,
    private formBuilder: FormBuilder, private snackBar: MatSnackBar, private dialog: MatDialog, private changeDetectorRef: ChangeDetectorRef) {
    this.workoutPlanForm = this.formBuilder.group({
      name: '',
      selectedExercises: []
    });
  }

  ngOnInit() {
    this.getExercises();
    this.getWorkoutPlans();
  }

  getWorkoutPlans() {
    this.workoutPlanService.getAll().subscribe(
      (workoutplans) => {
        this.workoutPlans = workoutplans;
      },
      (error) => {
        console.error('Error loading (workoutplans:', error);
      }
    );
  }

  getExercises() {
    this.exerciseService.getAll().subscribe(
      (exercises) => {
        this.exercises = exercises;
      },
      (error) => {
        console.error('Error loading exercises:', error);
      }
    );
  }

  openDialog(workoutPlan?: WorkoutPlan) {
    const dialogRef = this.dialog.open(WorkoutPlanDialogComponent, {
      width: '250px',
      data: { workoutPlan: workoutPlan }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.getWorkoutPlans();
        this.changeDetectorRef.detectChanges();
      }
    });
  }
}
