import { Component, OnInit } from '@angular/core';
import { Exercise, WorkoutPlan } from '../interfaces';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../fitness.service';
import { formatDate } from '@angular/common';

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

  constructor(private apiService: ApiService, private formBuilder: FormBuilder) {
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate, 'yyyy-MM-dd', 'en-US');
    this.workoutForm = this.formBuilder.group({
      date: formattedDate,
      exercises: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.getExercises();
    this.loadWorkoutPlans();
  }

  loadWorkoutPlans() {
    this.apiService.getWorkoutPlans().subscribe(
      (workoutplans) => {
        this.workoutPlans = workoutplans;
      },
      (error) => {
        console.error('Error loading (workoutplans:', error);
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
            sets: '',
            reps: '',
            weight: ''
          }));
        }
      });
    }
  }

  get exerciseControls(): FormGroup[] {
    return (this.workoutForm.get('exercises') as FormArray).controls as FormGroup[];
  }

  submitWorkout() {
    const workoutData = {
      date: this.workoutForm.value.date,
      workout_plan: this.selectedWorkoutPlanId,
    };
  
    this.apiService.addWorkout(workoutData).subscribe(
      (createdWorkout: any) => {
        this.createExerciseLogs(createdWorkout.id);
      },
      (error) => {
        console.error('Error creating workout:', error);
      }
    );
  }

  createExerciseLogs(workoutId: number) {
    const exerciseLogs = this.workoutForm.value.exercises;
  
    exerciseLogs.forEach((log: { exerciseId: any; sets: any; reps: any; weight: any; }) => {
      const exerciseLogData = {
        exercise: log.exerciseId,
        sets: log.sets,
        reps: log.reps,
        weight: log.weight,
        workout: [workoutId],
      };
  
      this.apiService.addExerciseLogs(exerciseLogData).subscribe(
        (response) => {
          console.log('Exercise log created successfully', response);
        },
        (error) => {
          console.error('Error creating exercise log:', error);
        }
      );
    });
  }

}
