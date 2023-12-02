import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../fitness.service';
import { Exercise } from '../interfaces';

@Component({
  selector: 'app-workout-plan',
  templateUrl: './workout-plan.component.html',
  styleUrls: ['./workout-plan.component.css']
})
export class WorkoutPlanComponent implements OnInit {
  exercises: Exercise[] | undefined;
  workoutPlanForm: FormGroup;

  constructor(private apiService: ApiService, private formBuilder: FormBuilder) {
    this.workoutPlanForm = this.formBuilder.group({
      name: '',
      selectedExercises: []
    });
  }

  ngOnInit() {
    this.getExercises();
  }

  getExercises() {
    this.apiService.getExercises().subscribe(
      (exercises) => {
        this.exercises = exercises;
      },
      (error) => {
        console.error('Error loading exercises:', error);
      }
    );
  }

  onSubmit() {
    // Logic to handle form submission, including selected exercises
    console.log(this.workoutPlanForm.value);
  }

}
