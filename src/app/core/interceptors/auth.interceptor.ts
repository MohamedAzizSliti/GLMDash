import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { NotificationService } from '../../shared/services/notification.service';
import { AuthClear } from '../../shared/action/auth.action';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private store: Store,
    private notificationService: NotificationService) {}
    private excludedUrls: string[] = ['gps-server'];

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {
    // Check if the request URL contains any of the excluded URLs
    const isExcluded = this.excludedUrls.some(url => req.url.includes(url));

    const token =  this.store.selectSnapshot(state => state.auth.access_token);

    if (token && !isExcluded) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          fromAdmin : 'true',
          'Accept-language': 'fr_FR' // added recently
        },
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.notificationService.notification = false;
          this.store.dispatch(new AuthClear());
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }

}
