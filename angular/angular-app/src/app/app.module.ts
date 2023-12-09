import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { PublicSpaceComponent } from './public-space/public-space.component';
import { RestrictedSpaceComponent } from './restricted-space/restricted-space.component';
import { JwtInterceptor } from './jwt.interceptor';
import { ExerciseComponent } from './fitnesstracker/exercise-list/exercise-dialog/exercise-dialog.component';
import { ExerciseListComponent } from './fitnesstracker/exercise-list/exercise-list.component';
import { WorkoutComponent } from './fitnesstracker/workout/workout.component';
import { WorkoutPlanComponent } from './fitnesstracker/workout-plan/workout-plan.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { WorkoutPlanDialogComponent } from './fitnesstracker/workout-plan/workout-plan-dialog/workout-plan-dialog.component';
import { WorkoutDisplayComponent } from './fitnesstracker/workout-display/workout-display.component';


function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8180/auth',
        realm: 'Project2',
        clientId: 'myapp',
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html',
      },
      loadUserProfileAtStartUp: true
    });
}

@NgModule({
  declarations: [
    AppComponent,
    TaskListComponent,
    PublicSpaceComponent,
    RestrictedSpaceComponent,
    ExerciseComponent,
    ExerciseListComponent,
    WorkoutComponent,
    WorkoutPlanComponent,
    WorkoutPlanDialogComponent,
    WorkoutDisplayComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    KeycloakAngularModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: initializeKeycloak,
    multi: true,
    deps: [KeycloakService]
  },{
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true,
  },
],
  bootstrap: [AppComponent]
})
export class AppModule {
}
