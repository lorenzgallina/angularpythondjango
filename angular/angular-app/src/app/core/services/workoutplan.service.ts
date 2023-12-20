import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { WorkoutPlan } from '../interfaces/fitness.interface';

@Injectable({
  providedIn: 'root'
})
export class WorkoutPlanService extends BaseService<WorkoutPlan> {
  constructor(http: HttpClient) {
    super(http, 'workout-plans');
  }
}
