import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Exercise, ExerciseLog, Workout, WorkoutPlan } from 'src/app/core/interfaces/fitness.interface';
import { ExerciseService } from 'src/app/core/services/exercise.service';
import { WorkoutService } from 'src/app/core/services/workout.service';
import { WorkoutPlanService } from 'src/app/core/services/workoutplan.service';
import { ExerciseLogService } from 'src/app/core/services/exerciselog.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.css']
})
export class WorkoutComponent implements OnInit {
  workoutPlans: WorkoutPlan[] | undefined;
  selectedWorkoutPlan: WorkoutPlan | undefined;
  workoutForm: FormGroup;
  selectedWorkoutPlanId: number | null = null;
  allExercises: Exercise[] | undefined;
  selectedExerciseGroup: FormGroup | null = null;
  routerplanid!: number | null;


  constructor(private exerciseService: ExerciseService,
    private workoutService: WorkoutService,
    private workoutPlanService: WorkoutPlanService,
    private exerciseLogService: ExerciseLogService,
    private formBuilder: FormBuilder, 
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router) 
    {
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate, 'yyyy-MM-dd', 'en-US');
    this.workoutForm = this.formBuilder.group({
      date: formattedDate,
      exercises: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.routerplanid = null;
    this.getExercises();
    this.loadWorkoutPlans();
    this.route.queryParams.subscribe(params => {
      if (params['planId']) {
        this.routerplanid = params['planId'];
        this.selectedWorkoutPlanId = this.routerplanid;
        this.onWorkoutPlanSelected();
      }
    });
  }

  loadWorkoutPlans() {
    this.workoutPlanService.getAll().subscribe(
      (workoutplans) => {
        this.workoutPlans = workoutplans;
        if (this.routerplanid){
          this.selectedWorkoutPlanId = this.routerplanid;
          this.onWorkoutPlanSelected();
        }
      },
      (error) => {
        console.error('Error loading (workoutplans:', error);
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

  selectExercise(index: number) {
    this.selectedExerciseGroup = this.exerciseControls[index];
  }

  onWorkoutPlanSelected() {
    if (this.selectedWorkoutPlanId !== null) {
    
      this.selectedWorkoutPlan = this.workoutPlans?.find(plan => plan.id === Number(this.selectedWorkoutPlanId));

      const exercisesFormArray = this.workoutForm.get('exercises') as FormArray;
      exercisesFormArray.clear();

      this.selectedWorkoutPlan?.exercises.forEach((exerciseId: number) => {
        const matchingexercise = this.allExercises?.find(e => e.id === exerciseId);
        if (matchingexercise) {
          exercisesFormArray.push(this.formBuilder.group({
            exerciseId: matchingexercise.id,
            name: matchingexercise.name,
            defaultSets: matchingexercise.default_sets,
            defaultReps: matchingexercise.default_reps,
            defaultWeight: matchingexercise.default_weight,
            sets: matchingexercise.default_sets,
            reps: matchingexercise.default_reps,
            weight: matchingexercise.default_weight,
            timer_active: matchingexercise.timer_active,
            time: 0,
            defaultTime: matchingexercise.time
          }));
        }
      });

      this.preselectFirstExercise();

      const queryParams = this.selectedWorkoutPlanId ? { planId: this.selectedWorkoutPlanId } : {};
      this.router.navigate(
        [], 
        {
          relativeTo: this.route,
          queryParams: queryParams,
          queryParamsHandling: 'merge',
        }
      );
    }
  }

  get exerciseControls(): FormGroup[] {
    return (this.workoutForm.get('exercises') as FormArray).controls as FormGroup[];
  }

  preselectFirstExercise() {
    if (this.exerciseControls.length > 0) {
      this.selectedExerciseGroup = this.exerciseControls[0];
    } else {
      this.selectedExerciseGroup = null;
    }
  }

  selectPreviousExercise() {
    if (this.selectedExerciseGroup) {
      const currentIndex = this.exerciseControls.indexOf(this.selectedExerciseGroup);
      if (currentIndex > 0) {
        this.selectedExerciseGroup = this.exerciseControls[currentIndex - 1];
      }
    }
  }

  selectNextExercise() {
    if (this.selectedExerciseGroup) {
      const currentIndex = this.exerciseControls.indexOf(this.selectedExerciseGroup);
      if (currentIndex >= 0 && currentIndex < this.exerciseControls.length - 1) {
        this.selectedExerciseGroup = this.exerciseControls[currentIndex + 1];
      }
    }
  }

  onTimeUpdated(time: number) {
    if (this.selectedExerciseGroup) {
      const roundedTime = Math.round(time);
      this.selectedExerciseGroup.patchValue({ time: roundedTime });
    }
  }

  submitWorkout() {
    const workoutData: Workout = {
      date: this.workoutForm.value.date,
      workout_plan: Number(this.selectedWorkoutPlanId),
    };
  
    this.workoutService.add(workoutData).subscribe(
      (createdWorkout: any) => {
        this.createExerciseLogs(createdWorkout.id);
        this.snackBar.open('Workout created successfully!', 'Close', { duration: 3000 });
      },
      (error) => {
        this.snackBar.open('Error creating workout.', 'Close', { duration: 3000 });
        console.error('Error creating workout:', error);
      }
    );
  }

  createExerciseLogs(workoutId: number) {
    const exerciseLogs = this.workoutForm.value.exercises;
  
    exerciseLogs.forEach((log: { exerciseId: any; sets: any; reps: any; weight: any; timer_active:any; time:any; }) => {
      const exerciseLogData: ExerciseLog = {
        exercise: log.exerciseId,
        sets: log.sets,
        reps: log.reps,
        weight: log.weight,
        time: log.time,
        timer_active: log.timer_active,
        workout: [workoutId],
      };
  
      this.exerciseLogService.add(exerciseLogData).subscribe(
        (response) => {
          this.snackBar.open('Exercise log created successfully!', 'Close', { duration: 3000 });
          console.log('Exercise log created successfully', response);
        },
        (error) => {
          this.snackBar.open('Error creating exercise log.', 'Close', { duration: 3000 });
          console.error('Error creating exercise log:', error);
        }
      );
    });
  }

}
