import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEmplois, getEmploisIdentifier } from '../emplois.model';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';

export type EntityResponseType = HttpResponse<IEmplois>;
export type EntityArrayResponseType = HttpResponse<IEmplois[]>;

@Injectable({ providedIn: 'root' })
export class EmploisService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/emplois');
  protected resourceUrlEmplois = this.applicationConfigService.getEndpointForBackend('api/emplois-by-code');
  protected resourceUrlRecherche = this.applicationConfigService.getEndpointForBackend('api/emplois/recherche');

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
  create(emplois: IEmplois): Observable<EntityResponseType> {
    return this.http.post<IEmplois>(this.resourceUrl, emplois, { observe: 'response' });
  }

  update(emplois: IEmplois): Observable<EntityResponseType> {
    return this.http.put<IEmplois>(`${this.resourceUrl}/${getEmploisIdentifier(emplois) as number}`, emplois, { observe: 'response' });
  }

  partialUpdate(emplois: IEmplois): Observable<EntityResponseType> {
    return this.http.patch<IEmplois>(`${this.resourceUrl}/${getEmploisIdentifier(emplois) as number}`, emplois, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEmplois>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByCode(code: string): Observable<EntityResponseType> {
    return this.http.get<IEmplois>(`${this.resourceUrlEmplois}?code=${code}`, { observe: 'response' });
  }
  recherche(motCle: string, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEmplois[]>(`${this.resourceUrlRecherche}?motCle=${motCle}`, { params: options, observe: 'response' });
  }

  findAll(): Observable<EntityArrayResponseType> {
    return this.http.get<IEmplois[]>(`${this.resourceUrl}/all`, { headers: this.header, observe: 'response' });
  }
  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEmplois[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEmploisToCollectionIfMissing(emploisCollection: IEmplois[], ...emploisToCheck: (IEmplois | null | undefined)[]): IEmplois[] {
    const emplois: IEmplois[] = emploisToCheck.filter(isPresent);
    if (emplois.length > 0) {
      const emploisCollectionIdentifiers = emploisCollection.map(emploisItem => getEmploisIdentifier(emploisItem)!);
      const emploisToAdd = emplois.filter(emploisItem => {
        const emploisIdentifier = getEmploisIdentifier(emploisItem);
        if (emploisIdentifier == null || emploisCollectionIdentifiers.includes(emploisIdentifier)) {
          return false;
        }
        emploisCollectionIdentifiers.push(emploisIdentifier);
        return true;
      });
      return [...emploisToAdd, ...emploisCollection];
    }
    return emploisCollection;
  }
}
