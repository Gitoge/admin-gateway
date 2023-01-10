import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

import { ApplicationConfigService } from '../config/application-config.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService,
    private applicationConfigService: ApplicationConfigService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const serverApiUrl = this.applicationConfigService.getEndpointFor('');
    const serverApiUrlBackend = this.applicationConfigService.getEndpointForBackend('');
    if (!request.url || (request.url.startsWith('http') && !(serverApiUrl && request.url.startsWith(serverApiUrl)))) {
      if (!request.url || (request.url.startsWith('http') && !(serverApiUrlBackend && request.url.startsWith(serverApiUrlBackend)))) {
        return next.handle(request);
      }
    }

    const token: string | null =
      this.localStorageService.retrieve('authenticationToken') ?? this.sessionStorageService.retrieve('authenticationToken');
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      this.router.navigate(['/login']);
    }

    return next.handle(request);
  }
}
