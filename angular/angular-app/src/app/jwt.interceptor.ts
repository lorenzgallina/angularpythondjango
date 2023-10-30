import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private keycloak: KeycloakService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Convert the Promise to an Observable using `from`
    return from(this.keycloak.isLoggedIn()).pipe(
      switchMap((isAuthenticated) => {
        if (isAuthenticated) {
          // Get the JWT token from Keycloak
          const token = this.keycloak.getKeycloakInstance().token;

          // Clone the request and add the Authorization header
          const authRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });

          return next.handle(authRequest);
        } else {
          // If the user is not authenticated, proceed with the original request
          return next.handle(request);
        }
      })
    );
  }
}
