import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { ApiService } from '../task.service';
import { Task } from '../../task';
import { KeycloakService } from 'keycloak-angular';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  API_URL = environment.apiUrl;

  tasks: Task[] | undefined;
  task_form: any;

  constructor(private keycloak: KeycloakService, private apiService: ApiService, private form_builder: FormBuilder) { }



  ngOnInit() {
    this.getTasks()

    this.task_form = this.form_builder.group({
      title: '',
      content: ''
    });

    this.task_form.controls["title"].setValidators([Validators.required]);
    this.task_form.controls["content"].setValidators([Validators.required]);
  }


  getDisplayName(): string {
    const userProfile = this.keycloak.loadUserProfile;
    return userProfile ? userProfile.name : '';
  }

  public getTasks() {
    this.apiService.getTasks().subscribe(
      (tasks) => {
        this.tasks = tasks;
      },
      (error) => {
        console.error('Error loading tasks:', error);
      }
    );
  }

  onSubmit() {
    this.apiService.postTask(this.task_form.value)
      .subscribe(
        (response) => {
          console.log(response);
          this.getTasks();
        }
      )
  }

  deleteTask(task_id: number) {
    this.apiService.deleteTask(task_id)
      .subscribe(
        (response) => {
          console.log(response);
          this.getTasks();
        }
      )
  }

  updateTask(task: Task) {
    this.apiService.putTask(task)
      .subscribe(
        (response) => {
          console.log(response);
          this.getTasks();
        }
      )
  }

}
