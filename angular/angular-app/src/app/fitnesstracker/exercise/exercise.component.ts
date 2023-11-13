import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { ApiService } from '../fitness.service';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Exercise } from '../interfaces';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.css']
})
export class ExerciseComponent {

  API_URL = environment.apiUrl;

  exercises: Exercise[] | undefined;

  constructor(private keycloak: KeycloakService, private apiService: ApiService, private form_builder: FormBuilder) {}

  ngOnInit() {
    this.getExercises()
  }

  public getExercises() {
    this.apiService.getExercises().subscribe(
      (tasks) => {
        this.exercises = tasks;
      },
      (error) => {
        console.error('Error loading tasks:', error);
      }
    );
  }

}
