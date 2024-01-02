import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isLoggedIn = false;
  title = 'angular-app';
  isMobile: boolean = false;

  constructor(private keycloakService: KeycloakService, private breakpointObserver: BreakpointObserver) {}
  

  ngOnInit(): void {
    this.keycloakService.isLoggedIn().then(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  toggleSidenav() {
    this.sidenav.toggle();
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
