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
  images!: any [];

  mobileImages = [
    { url: 'assets/quotes/G1.jpg', alt: 'Image 1', caption: 'YOU CAN DO IT' },
    { url: 'assets/quotes/G2.jpg', alt: 'Image 2', caption: 'BUILD A STRONG MINDSET THE BODY WILL FOLLOW' },
    { url: 'assets/quotes/G3.jpg', alt: 'Image 3', caption: 'PUSH YOURSELF TO THE LIMIT' },
    { url: 'assets/quotes/G4.jpg', alt: 'Image 4', caption: 'IF IT WERE EASY EVERYONE WOULD HAVE DONE IT' },
    { url: 'assets/quotes/G5.jpg', alt: 'Image 5', caption: 'PROGRESS OVER PERFECTION' },
    { url: 'assets/quotes/G6.jpg', alt: 'Image 6', caption: 'THE KEY TO SUCCESS IS TO START BEFORE YOU ARE READY' },
  ];

  desktopImages = [
    { url: 'assets/quotes/DG4.jpg', alt: 'Image 5', caption: 'YOU CAN DO IT' },
    { url: 'assets/quotes/G1.jpg', alt: 'Image 1', caption: 'PROGRESS OVER PERFECTION' },
    { url: 'assets/quotes/DG2.jpg', alt: 'Image 2', caption: 'BUILD A STRONG MINDSET THE BODY WILL FOLLOW' },
    { url: 'assets/quotes/DG3.jpg', alt: 'Image 3', caption: 'IF IT WERE EASY EVERYONE WOULD HAVE DONE IT' },
    { url: 'assets/quotes/DG5.jpg', alt: 'Image 6', caption: 'THE KEY TO SUCCESS IS TO START BEFORE YOU ARE READY' },
  ];

  slideConfig = {
    "slidesToShow": 1, 
    "slidesToScroll": 1,
    "dots": true,
    "infinite": true,
    "autoplay": true,
    "autoplaySpeed": 5000
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
        this.images = this.isMobile ? this.mobileImages : this.desktopImages;
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
