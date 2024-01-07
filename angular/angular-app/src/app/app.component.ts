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
  images = [
    { url: 'assets/quotes/GYMTS2Q22.jpg', alt: 'Image 1' },
    { url: 'assets/quotes/GYMTS3Q12.jpg', alt: 'Image 2' },
    { url: 'assets/quotes/GYMTS5Q32.jpg', alt: 'Image 2' },
    // add more images as needed
  ];
  slideConfig = {
    "slidesToShow": 1, 
    "slidesToScroll": 1,
    "dots": true,
    "infinite": true,
    "autoplay": true,
    "autoplaySpeed": 4000
  };

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
    this.router.navigate(['/starting-page']).then(() => {
      this.keycloakService.logout().catch(error => {
        console.error('Logout failed', error);
      });
    });
  }

  redirectToRegistration() {
    window.location.href = 'http://localhost/api/accounts/register'; // URL to your Django registration view
  }
}
