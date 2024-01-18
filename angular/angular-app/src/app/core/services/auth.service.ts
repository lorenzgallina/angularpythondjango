import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(private keycloakService: KeycloakService) {
    this.checkLoginStatus();
  }

  private checkLoginStatus() {
    this.keycloakService.isLoggedIn().then(loggedIn => {
      this.isLoggedIn.next(loggedIn);
    });
  }

  get isLoggedIn$() {
    return this.isLoggedIn.asObservable();
  }

}
