import { ChangeDetectorRef, Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ExerciseComponent } from './exercise-dialog/exercise-dialog.component';
import { ExerciseService } from 'src/app/core/services/exercise.service';
import { Exercise } from 'src/app/core/interfaces/fitness.interface';

@Component({
  selector: 'app-exercise-list',
  templateUrl: './exercise-list.component.html',
  styleUrls: ['./exercise-list.component.css']
})
export class ExerciseListComponent {
  API_URL = environment.apiUrl;

  exercises: Exercise[] = [];
  displayedColumns: string[] = ['name', 'default_weight', 'default_sets', 'default_reps', 'actions'];


  constructor(private exerciseService: ExerciseService, private dialog: MatDialog, private changeDetectorRef: ChangeDetectorRef) {}
  
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
