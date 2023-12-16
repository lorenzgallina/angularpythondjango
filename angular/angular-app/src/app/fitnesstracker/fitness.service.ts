import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Exercise, ExerciseLog, Workout, WorkoutPlan } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {  }


  public getExercises(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.API_URL}/exercises/`);
  }

  public addExercise(new_exercise: Exercise) {
    return this.http.post(`${this.API_URL}/exercises/`,new_exercise);
  }

  public updateExercise(exercise: Exercise) {
    return this.http.put(`${this.API_URL}/exercises/${exercise.id}/`,exercise);
  }

  public deleteExercise(exercise_id: number) {
    return this.http.delete(`${this.API_URL}/exercises/${exercise_id}/`);
  }

  
  public getWorkoutPlans(): Observable<WorkoutPlan[]> {
    return this.http.get<WorkoutPlan[]>(`${this.API_URL}/workout-plans/`);
  }

  public addWorkoutPlan(workoutplan: any) {
    return this.http.post(`${this.API_URL}/workout-plans/`, workoutplan);
  }

  public updateWorkoutPlan(workoutplan: any) {
    return this.http.put(`${this.API_URL}/workout-plans/${workoutplan.id}/`,workoutplan);
  }

  public deleteWorkoutPlan(workoutplan_id: number) {
    return this.http.delete(`${this.API_URL}/workout-plans/${workoutplan_id}/`);
  }

  public addWorkout(workout: any) {
    return this.http.post(`${this.API_URL}/workouts/`, workout);
  }

  public getWorkoutByWorkoutPlanID(workoutplan_id: any) {
    return this.http.get<Workout[]>(`${this.API_URL}/workouts/?workout_plan=${workoutplan_id}`);
  }

  public addExerciseLogs(exerciselogs: any) {
    return this.http.post(`${this.API_URL}/exercise-logs/`, exerciselogs);
  }

  public getExerciseLogsByWorkoutId(workout_id: number) {
    return this.http.get<ExerciseLog[]>(`${this.API_URL}/exercise-logs/?workout=${workout_id}`);
  }

  public getAllExerciseLogsGroupedByWorkout(workoutplan_id?: number) {
    let url = `${this.API_URL}/exercise-logs/grouped_by_workout/`;
    if (workoutplan_id) {
      url += `?workout_plan=${workoutplan_id}`;
    }
    return this.http.get<{ [key: number]: ExerciseLog[] }>(url);
  }
  

}
