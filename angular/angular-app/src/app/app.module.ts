import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgChartsModule } from 'ng2-charts';
import { MatSidenavModule } from '@angular/material/sidenav';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
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

// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

// Flex Layout Module
import { FlexLayoutModule } from '@angular/flex-layout';
import { RegisterComponent } from './register/register.component';
import { ContactComponent } from './contact/contact.component';
import { StartingPageComponent } from './starting-page/starting-page.component';
import { TimerComponent } from './fitnesstracker/timer/timer.component';
import { WorkoutDialogComponent } from './fitnesstracker/workout/workout-dialog/workout-dialog.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';



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
    ExerciseComponent,
    ExerciseListComponent,
    WorkoutComponent,
    WorkoutPlanComponent,
    WorkoutPlanDialogComponent,
    WorkoutDisplayComponent,
    RegisterComponent,
    ContactComponent,
    StartingPageComponent,
    TimerComponent,
    WorkoutDialogComponent,
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
    MatSnackBarModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatSelectModule,
    FlexLayoutModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatExpansionModule,
    NgChartsModule,
    MatSidenavModule,
    MatIconModule,
    MatMenuModule,
    SlickCarouselModule
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
