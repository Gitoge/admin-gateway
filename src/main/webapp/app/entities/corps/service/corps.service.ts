import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICorps, getCorpsIdentifier } from '../corps.model';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';

export type EntityResponseType = HttpResponse<ICorps>;
export type EntityArrayResponseType = HttpResponse<ICorps[]>;

@Injectable({ providedIn: 'root' })
export class CorpsService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/corps');

  private header: HttpHeaders;

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    private authServerProvider: AuthServerProvider
  ) {
    this.header = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.authServerProvider.getToken())
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');
  }

  create(corps: ICorps): Observable<EntityResponseType> {
    return this.http.post<ICorps>(this.resourceUrl, corps, { observe: 'response' });
  }

  update(corps: ICorps): Observable<EntityResponseType> {
    return this.http.put<ICorps>(`${this.resourceUrl}/${getCorpsIdentifier(corps) as number}`, corps, { observe: 'response' });
  }

  partialUpdate(corps: ICorps): Observable<EntityResponseType> {
    return this.http.patch<ICorps>(`${this.resourceUrl}/${getCorpsIdentifier(corps) as number}`, corps, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICorps>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findAll(): Observable<EntityArrayResponseType> {
    return this.http.get<ICorps[]>(`${this.resourceUrl}/all`, { headers: this.header, observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICorps[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCorpsToCollectionIfMissing(corpsCollection: ICorps[], ...corpsToCheck: (ICorps | null | undefined)[]): ICorps[] {
    const corps: ICorps[] = corpsToCheck.filter(isPresent);
    if (corps.length > 0) {
      const corpsCollectionIdentifiers = corpsCollection.map(corpsItem => getCorpsIdentifier(corpsItem)!);
      const corpsToAdd = corps.filter(corpsItem => {
        const corpsIdentifier = getCorpsIdentifier(corpsItem);
        if (corpsIdentifier == null || corpsCollectionIdentifiers.includes(corpsIdentifier)) {
          return false;
        }
        corpsCollectionIdentifiers.push(corpsIdentifier);
        return true;
      });
      return [...corpsToAdd, ...corpsCollection];
    }
    return corpsCollection;
  }
}
