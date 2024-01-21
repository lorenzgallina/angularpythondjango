import { Component } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { environment } from 'src/environments/environment';
import { Exercise } from '../core/interfaces/fitness.interface';
import { ExerciseService } from '../core/services/exercise.service';

@Component({
  selector: 'app-starting-page',
  templateUrl: './starting-page.component.html',
  styleUrls: ['./starting-page.component.css']
})
export class StartingPageComponent {
  isLoggedIn = false;
  API_URL = environment.apiUrl;
  exercises: Exercise[] = [];

  constructor(private authService: AuthService, private exerciseService: ExerciseService) {}
  
  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      this.getExercises();

    });
  }

  getExercises() {
    this.exerciseService.getAll().subscribe(
      (exercises) => {
        this.exercises = exercises;
      },
      (error) => {
        console.error('Error loading exercises:', error);
      }
    );
  }

}
