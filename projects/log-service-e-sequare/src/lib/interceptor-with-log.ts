import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LogService } from './log-service-e-sequare.service';


@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor (private logService: LogService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {
        this.logService.log(error.message);
          return throwError(error);
        })
     );
  }
}