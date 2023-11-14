import { Component, EventEmitter, Inject, Input, Optional, Output } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { ApiService } from '../fitness.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Exercise } from '../interfaces';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.css']
})

export class ExerciseComponent {
  exerciseForm: FormGroup;
  isEditing = false;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, public dialogRef: MatDialogRef<ExerciseComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: {exercise: Exercise}) {
    this.exerciseForm = this.formBuilder.group({
      id: '',
      name: '',
      default_weight: '',
      default_sets: '',
      default_reps: '',
      // user: ''
    });

    if (data && data.exercise) {
      this.isEditing = true;
      this.exerciseForm.patchValue(data.exercise);
    }
  }

  onSubmit() {
    if (this.isEditing) {
      this.apiService.updateExercise(this.exerciseForm.value).subscribe(
        // todo: Handle response and errors
      );
    } else {
      this.apiService.addExercise(this.exerciseForm.value).subscribe(
        // todo: Handle response and errors
      );
    }
    this.dialogRef.close();
  }

  addExercise() {
    const ex = this.exerciseForm.value;

    this.apiService.addExercise(this.exerciseForm.value).subscribe(
      response => {
        // todo: Handle response here
      },
      error => {
        console.error('Error adding exercise:', error);
      }
    );
  }

  updateExercise(exercise: Exercise) {
    this.apiService.updateExercise(this.exerciseForm.value).subscribe(
      response => {
        // todo: Handle response here
      },
      error => {
        console.error('Error updating exercise:', error);
      }
    );
  }
}