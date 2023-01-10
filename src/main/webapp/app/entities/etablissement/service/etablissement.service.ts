import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEtablissement, getEtablissementIdentifier } from '../etablissement.model';
import { IInfosConventionEtablissements } from '../infos-convention-etablissement.model';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';

export type EntityResponseType = HttpResponse<IEtablissement>;
export type EntityArrayResponseType = HttpResponse<IEtablissement[]>;

export type EntityArrayResponseTypeConvention = HttpResponse<IInfosConventionEtablissements[]>;

@Injectable({ providedIn: 'root' })
export class EtablissementService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/etablissements');

  protected resourceUrlIdEtablissement = this.applicationConfigService.getEndpointForBackend('api/etablissementId');

  protected resourceUrlLocalite = this.applicationConfigService.getEndpointForBackend('api/etablissements-localite');

  protected resourceUrlEtablissementRecherche = this.applicationConfigService.getEndpointForBackend('api/etablissements/recherche');

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

  create(etablissement: IEtablissement): Observable<EntityResponseType> {
    return this.http.post<IEtablissement>(this.resourceUrl, etablissement, { observe: 'response' });
  }

  update(etablissement: IEtablissement): Observable<EntityResponseType> {
    return this.http.put<IEtablissement>(`${this.resourceUrl}/${getEtablissementIdentifier(etablissement) as number}`, etablissement, {
      observe: 'response',
    });
  }

  partialUpdate(etablissement: IEtablissement): Observable<EntityResponseType> {
    return this.http.patch<IEtablissement>(`${this.resourceUrl}/${getEtablissementIdentifier(etablissement) as number}`, etablissement, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEtablissement>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findAll(): Observable<EntityArrayResponseType> {
    return this.http.get<IEtablissement[]>(`${this.resourceUrl}/all`, { headers: this.header, observe: 'response' });
  }

  findEtablissementByLocaliteId(localiteId: number): any {
    return this.http.get<IEtablissement>(`${this.resourceUrlLocalite}/${localiteId}`, { observe: 'response' });
  }

  findEtablissementByEtablissementId(etablissementId: number): any {
    return this.http.get<IEtablissement>(`${this.resourceUrl}/alll?etablissementId=${etablissementId}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEtablissement[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  findEtablissementByMotsCles(motCles: string, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEtablissement[]>(`${this.resourceUrlEtablissementRecherche}?motCles=${motCles}`, {
      params: options,
      observe: 'response',
    });
  }

  findEtablissementById(idEtablissement: number): Observable<EntityArrayResponseType> {
    return this.http.get<IEtablissement[]>(`${this.resourceUrlIdEtablissement}?idEtablissement=${idEtablissement}`, {
      observe: 'response',
    });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEtablissementToCollectionIfMissing(
    etablissementCollection: IEtablissement[],
    ...etablissementsToCheck: (IEtablissement | null | undefined)[]
  ): IEtablissement[] {
    const etablissements: IEtablissement[] = etablissementsToCheck.filter(isPresent);
    if (etablissements.length > 0) {
      const etablissementCollectionIdentifiers = etablissementCollection.map(
        etablissementItem => getEtablissementIdentifier(etablissementItem)!
      );
      const etablissementsToAdd = etablissements.filter(etablissementItem => {
        const etablissementIdentifier = getEtablissementIdentifier(etablissementItem);
        if (etablissementIdentifier == null || etablissementCollectionIdentifiers.includes(etablissementIdentifier)) {
          return false;
        }
        etablissementCollectionIdentifiers.push(etablissementIdentifier);
        return true;
      });
      return [...etablissementsToAdd, ...etablissementCollection];
    }
    return etablissementCollection;
  }
}
