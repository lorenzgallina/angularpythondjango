import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  isLoggedIn = false;
  title = 'angular-app';

  constructor(private keycloakService: KeycloakService) {}
  

  ngOnInit(): void {
    this.keycloakService.isLoggedIn().then(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  login() {
    this.keycloakService.login();
  }

  logout() {
    this.keycloakService.logout();
  }

  redirectToRegistration() {
    window.location.href = 'http://localhost/api/accounts/register'; // URL to your Django registration view
  }
}
