import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { AuthService } from './core/services/auth.service';

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

  constructor(private router: Router, private keycloakService: KeycloakService, private breakpointObserver: BreakpointObserver, private authService: AuthService) {}
  

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
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
    this.router.navigate(['/starting-page']);
  }

  logout() {
    this.router.navigate(['/starting-page']);
    this.keycloakService.logout();
  }

  redirectToRegistration() {
    window.location.href = 'http://localhost/api/accounts/register'; // URL to your Django registration view
  }
}
