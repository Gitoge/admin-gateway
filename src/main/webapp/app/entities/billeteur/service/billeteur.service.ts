import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBilleteur, getBilleteurIdentifier } from '../billeteur.model';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';

export type EntityResponseType = HttpResponse<IBilleteur>;
export type EntityArrayResponseType = HttpResponse<IBilleteur[]>;

@Injectable({ providedIn: 'root' })
export class BilleteurService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/billeteurs');

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

  create(billeteur: IBilleteur): Observable<EntityResponseType> {
    return this.http.post<IBilleteur>(this.resourceUrl, billeteur, { observe: 'response' });
  }

  update(billeteur: IBilleteur): Observable<EntityResponseType> {
    return this.http.put<IBilleteur>(`${this.resourceUrl}/${getBilleteurIdentifier(billeteur) as number}`, billeteur, {
      observe: 'response',
    });
  }

  partialUpdate(billeteur: IBilleteur): Observable<EntityResponseType> {
    return this.http.patch<IBilleteur>(`${this.resourceUrl}/${getBilleteurIdentifier(billeteur) as number}`, billeteur, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBilleteur>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findAll(): Observable<EntityArrayResponseType> {
    return this.http.get<IBilleteur[]>(`${this.resourceUrl}/all`, { headers: this.header, observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBilleteur[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBilleteurToCollectionIfMissing(
    billeteurCollection: IBilleteur[],
    ...billeteursToCheck: (IBilleteur | null | undefined)[]
  ): IBilleteur[] {
    const billeteurs: IBilleteur[] = billeteursToCheck.filter(isPresent);
    if (billeteurs.length > 0) {
      const billeteurCollectionIdentifiers = billeteurCollection.map(billeteurItem => getBilleteurIdentifier(billeteurItem)!);
      const billeteursToAdd = billeteurs.filter(billeteurItem => {
        const billeteurIdentifier = getBilleteurIdentifier(billeteurItem);
        if (billeteurIdentifier == null || billeteurCollectionIdentifiers.includes(billeteurIdentifier)) {
          return false;
        }
        billeteurCollectionIdentifiers.push(billeteurIdentifier);
        return true;
      });
      return [...billeteursToAdd, ...billeteurCollection];
    }
    return billeteurCollection;
  }
}
