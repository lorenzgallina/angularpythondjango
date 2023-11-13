import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../task';
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

  public postExercise(new_exercise: Exercise) {
    return this.http.post(`${this.API_URL}exercises/`,new_exercise);
  }

  public putExercise(the_exercise: Exercise) {
    return this.http.put(`${this.API_URL}/exercises/${the_exercise.id}/`,the_exercise);
  }

  public deleteExercise(exercise_id: number) {
    return this.http.delete(`${this.API_URL}/exercises/${exercise_id}/`);
  }

}
