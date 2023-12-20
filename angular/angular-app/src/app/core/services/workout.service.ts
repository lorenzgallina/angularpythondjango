import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { Workout } from '../interfaces/fitness.interface';
//import { environment } from 'src/environments/environment'; // Ensure the correct path

@Injectable({
  providedIn: 'root'
})
export class WorkoutService extends BaseService<Workout> {
  //private API_URL = environment.apiUrl; // Access the API URL

  constructor(http: HttpClient) {
    super(http, 'workouts');
  }

  getWorkoutByWorkoutPlanID(workoutplan_id: number): Observable<Workout[]> {
    return this.http.get<Workout[]>(`${this.API_URL}/workouts/?workout_plan=${workoutplan_id}`);
  }
}
