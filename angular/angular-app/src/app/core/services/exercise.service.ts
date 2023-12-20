import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Exercise } from '../interfaces/fitness.interface';


@Injectable({
  providedIn: 'root'
})
export class ExerciseService extends BaseService<Exercise> {
  constructor(http: HttpClient) {
    super(http, 'exercises');
  }
}
