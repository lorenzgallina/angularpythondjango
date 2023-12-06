import { ChangeDetectorRef, Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { ApiService } from '../fitness.service';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Exercise } from '../interfaces';
import { MatDialog } from '@angular/material/dialog';
import { ExerciseComponent } from './exercise-dialog/exercise-dialog.component';

@Component({
  selector: 'app-exercise-list',
  templateUrl: './exercise-list.component.html',
  styleUrls: ['./exercise-list.component.css']
})
export class ExerciseListComponent {
  API_URL = environment.apiUrl;

  exercises: Exercise[] | undefined;

  constructor(private keycloak: KeycloakService, private apiService: ApiService, private form_builder: FormBuilder, private dialog: MatDialog, private changeDetectorRef: ChangeDetectorRef) {}
  
  ngOnInit() {
    this.getExercises()
  }

  openDialog(exercise?: Exercise) {
    const dialogRef = this.dialog.open(ExerciseComponent, {
      width: '250px',
      data: { exercise: exercise }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.getExercises();
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  getExercises() {
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
