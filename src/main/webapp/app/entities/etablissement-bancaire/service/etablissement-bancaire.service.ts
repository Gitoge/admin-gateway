import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEtablissementBancaire, getEtablissementBancaireIdentifier } from '../etablissement-bancaire.model';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';

export type EntityResponseType = HttpResponse<IEtablissementBancaire>;
export type EntityArrayResponseType = HttpResponse<IEtablissementBancaire[]>;

@Injectable({ providedIn: 'root' })
export class EtablissementBancaireService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/etablissement-bancaires');

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

  create(etablissementBancaire: IEtablissementBancaire): Observable<EntityResponseType> {
    return this.http.post<IEtablissementBancaire>(this.resourceUrl, etablissementBancaire, { observe: 'response' });
  }

  update(etablissementBancaire: IEtablissementBancaire): Observable<EntityResponseType> {
    return this.http.put<IEtablissementBancaire>(
      `${this.resourceUrl}/${getEtablissementBancaireIdentifier(etablissementBancaire) as number}`,
      etablissementBancaire,
      { observe: 'response' }
    );
  }

  partialUpdate(etablissementBancaire: IEtablissementBancaire): Observable<EntityResponseType> {
    return this.http.patch<IEtablissementBancaire>(
      `${this.resourceUrl}/${getEtablissementBancaireIdentifier(etablissementBancaire) as number}`,
      etablissementBancaire,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEtablissementBancaire>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findAll(): Observable<EntityArrayResponseType> {
    return this.http.get<IEtablissementBancaire[]>(`${this.resourceUrl}/all`, { headers: this.header, observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEtablissementBancaire[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEtablissementBancaireToCollectionIfMissing(
    etablissementBancaireCollection: IEtablissementBancaire[],
    ...etablissementBancairesToCheck: (IEtablissementBancaire | null | undefined)[]
  ): IEtablissementBancaire[] {
    const etablissementBancaires: IEtablissementBancaire[] = etablissementBancairesToCheck.filter(isPresent);
    if (etablissementBancaires.length > 0) {
      const etablissementBancaireCollectionIdentifiers = etablissementBancaireCollection.map(
        etablissementBancaireItem => getEtablissementBancaireIdentifier(etablissementBancaireItem)!
      );
      const etablissementBancairesToAdd = etablissementBancaires.filter(etablissementBancaireItem => {
        const etablissementBancaireIdentifier = getEtablissementBancaireIdentifier(etablissementBancaireItem);
        if (
          etablissementBancaireIdentifier == null ||
          etablissementBancaireCollectionIdentifiers.includes(etablissementBancaireIdentifier)
        ) {
          return false;
        }
        etablissementBancaireCollectionIdentifiers.push(etablissementBancaireIdentifier);
        return true;
      });
      return [...etablissementBancairesToAdd, ...etablissementBancaireCollection];
    }
    return etablissementBancaireCollection;
  }
}
