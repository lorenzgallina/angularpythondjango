import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Exercise } from './interfaces';

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

  public createWorkoutPlan(workoutPlan: any) {
    return this.http.post(`${this.API_URL}/workout-plans/`, workoutPlan);
  }

}
