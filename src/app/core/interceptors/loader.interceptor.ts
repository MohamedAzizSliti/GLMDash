import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { HideLoaderAction, ShowLoaderAction,
  ShowButtonSpinnerAction, HideButtonSpinnerAction } from '../../shared/action/loader.action';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
   // private excludedUrls: string[] = ['traccar','gps-server'];
  private excludedUrls: string[] = ['gps-server'];
  constructor(private store: Store) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // Check if the request URL contains any of the excluded URLs
      const isExcluded = this.excludedUrls.some(url => req.url.includes(url));
      if ( !isExcluded) {
          Promise.resolve(null).then(() => {
              this.store.dispatch(new ShowLoaderAction(req.method == 'GET' ? true : false));
              this.store.dispatch(new ShowButtonSpinnerAction(req.method != 'GET' ? true : false));
          });
      }


    return next.handle(req).pipe(
      tap(
        {
          error: (err) => {
              if ( !isExcluded) {
                  this.store.dispatch(new HideLoaderAction());
                  this.store.dispatch(new HideButtonSpinnerAction());
              }
          },
          complete: () => {
              if ( !isExcluded) {
                  this.store.dispatch(new HideLoaderAction());
                  this.store.dispatch(new HideButtonSpinnerAction());
              }
          }
        }
      )
    );

  }
}
