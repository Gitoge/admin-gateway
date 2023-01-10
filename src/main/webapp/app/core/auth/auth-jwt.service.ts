import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

import { ApplicationConfigService } from '../config/application-config.service';
import { Login } from 'app/login/login.model';

import { SERVER_API_URL_BACKEND } from 'app/app.constants';
import { IUserInfos } from 'app/shared/model/userInfos';
import { Router } from '@angular/router';
type EntityResponseType = HttpResponse<IUserInfos>;

type JwtToken = {
  id_token: string;
};

@Injectable({ providedIn: 'root' })
export class AuthServerProvider {
  private header: HttpHeaders | undefined;
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService,
    private applicationConfigService: ApplicationConfigService,
    private router: Router
  ) {}

  getToken(): string {
    const tokenInLocalStorage: string | null = this.localStorageService.retrieve('authenticationToken');
    const tokenInSessionStorage: string | null = this.sessionStorageService.retrieve('authenticationToken');
    return tokenInLocalStorage ?? tokenInSessionStorage ?? '';
  }

  login(credentials: Login): Observable<void> {
    return this.http
      .post<JwtToken>(this.applicationConfigService.getEndpointFor('api/authenticate'), credentials)
      .pipe(map(response => this.authenticateSuccess(response, credentials.rememberMe)));
  }

  logout(): Observable<void> {
    return new Observable(observer => {
      this.localStorageService.clear('authenticationToken');
      this.sessionStorageService.clear('authenticationToken');
      this.router.navigate(['/login']);
      observer.complete();
    });
  }

  getAffectationByUsername(username: string): Observable<EntityResponseType> {
    this.header = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.getToken())
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');

    return this.http
      .get<IUserInfos>(`${SERVER_API_URL_BACKEND}api/application/user?username=${username}`, {
        headers: this.header,
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => res));
  }

  private authenticateSuccess(response: JwtToken, rememberMe: boolean): void {
    const jwt = response.id_token;
    if (rememberMe) {
      this.localStorageService.store('authenticationToken', jwt);
      this.sessionStorageService.clear('authenticationToken');
    } else {
      this.sessionStorageService.store('authenticationToken', jwt);
      this.localStorageService.clear('authenticationToken');
    }
  }
}
