import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicSpaceComponent } from './public-space/public-space.component';
import { KeycloakGuard } from './keycloak.guard';
import { ExerciseListComponent } from './fitnesstracker/exercise-list/exercise-list.component';
import { WorkoutPlanComponent } from './fitnesstracker/workout-plan/workout-plan.component';
import { WorkoutComponent } from './fitnesstracker/workout/workout.component';
import { WorkoutDisplayComponent } from './fitnesstracker/workout-display/workout-display.component';
import { RegisterComponent } from './register/register.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  { path: 'public', component: PublicSpaceComponent },
  { path: 'exercises', component: ExerciseListComponent, canActivate: [KeycloakGuard] },
  { path: 'workout-plan', component: WorkoutPlanComponent, canActivate: [KeycloakGuard] },
  { path: 'workout', component: WorkoutComponent, canActivate: [KeycloakGuard] },
  { path: 'workout-display', component: WorkoutDisplayComponent, canActivate: [KeycloakGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', component: PublicSpaceComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
