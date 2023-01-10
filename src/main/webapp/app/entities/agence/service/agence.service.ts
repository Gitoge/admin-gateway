import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAgence, getAgenceIdentifier } from '../agence.model';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';

export type EntityResponseType = HttpResponse<IAgence>;
export type EntityArrayResponseType = HttpResponse<IAgence[]>;

@Injectable({ providedIn: 'root' })
export class AgenceService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/agence');

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

  create(agence: IAgence): Observable<EntityResponseType> {
    return this.http.post<IAgence>(this.resourceUrl, agence, { observe: 'response' });
  }

  update(agence: IAgence): Observable<EntityResponseType> {
    return this.http.put<IAgence>(`${this.resourceUrl}/${getAgenceIdentifier(agence) as number}`, agence, { observe: 'response' });
  }

  partialUpdate(agence: IAgence): Observable<EntityResponseType> {
    return this.http.patch<IAgence>(`${this.resourceUrl}/${getAgenceIdentifier(agence) as number}`, agence, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAgence>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findAll(): Observable<EntityArrayResponseType> {
    return this.http.get<IAgence[]>(`${this.resourceUrl}/all`, { headers: this.header, observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAgence[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAgenceToCollectionIfMissing(agenceCollection: IAgence[], ...agencesToCheck: (IAgence | null | undefined)[]): IAgence[] {
    const agences: IAgence[] = agencesToCheck.filter(isPresent);
    if (agences.length > 0) {
      const agenceCollectionIdentifiers = agenceCollection.map(agenceItem => getAgenceIdentifier(agenceItem)!);
      const agencesToAdd = agences.filter(agenceItem => {
        const agenceIdentifier = getAgenceIdentifier(agenceItem);
        if (agenceIdentifier == null || agenceCollectionIdentifiers.includes(agenceIdentifier)) {
          return false;
        }
        agenceCollectionIdentifiers.push(agenceIdentifier);
        return true;
      });
      return [...agencesToAdd, ...agenceCollection];
    }
    return agenceCollection;
  }
}
