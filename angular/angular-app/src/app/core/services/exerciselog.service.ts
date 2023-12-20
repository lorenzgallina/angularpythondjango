import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { ExerciseLog } from '../interfaces/fitness.interface';
//import { environment } from 'src/environments/environment'; // Ensure the correct path

@Injectable({
  providedIn: 'root'
})
export class ExerciseLogService extends BaseService<ExerciseLog> {
  //private API_URL = environment.apiUrl; // Access the API URL

  constructor(http: HttpClient) {
    super(http, 'exercise-logs');
  }

  getAllExerciseLogsGroupedByWorkout(workoutplan_id?: number): Observable<{ [key: number]: ExerciseLog[] }> {
    let url = `${this.API_URL}/exercise-logs/grouped_by_workout/`;
    if (workoutplan_id) {
      url += `?workout_plan=${workoutplan_id}`;
    }
    return this.http.get<{ [key: number]: ExerciseLog[] }>(url);
  }
}
