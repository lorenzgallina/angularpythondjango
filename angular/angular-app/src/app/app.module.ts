import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskListComponent } from './task-list/task-list.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { PublicSpaceComponent } from './public-space/public-space.component';
import { RestrictedSpaceComponent } from './restricted-space/restricted-space.component';
import { JwtInterceptor } from './jwt.interceptor';


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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    KeycloakAngularModule,
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: initializeKeycloak,
    multi: true,
    deps: [KeycloakService]
  },{
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor, // Use your JWT interceptor
    multi: true,
  },
],
  bootstrap: [AppComponent]
})
export class AppModule {
}
