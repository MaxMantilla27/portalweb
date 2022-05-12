import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add custom header
    const customReq = request.clone({
      headers: request.headers.set('app-authore', 'Dzhavat'),
    });

    //console.log('processing request', customReq);

    // pass on the modified request object
    return next.handle(customReq).pipe(
      tap(
          (event : HttpEvent<any>) => {
              if (event instanceof HttpResponse) {
                      //Manejar la respuesta
                }
          },
          (error : HttpErrorResponse ) => {
              if (error.status == 401) {
                  // this.authService.logout();
                  // this.router.navigate(['/login']);
              }
          }
      )
  )
  }
}
