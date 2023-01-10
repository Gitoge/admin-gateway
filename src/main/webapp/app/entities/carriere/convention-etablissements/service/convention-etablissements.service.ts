import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IConventionEtablissements, getConventionEtablissementsIdentifier } from '../convention-etablissements.model';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';

export type EntityResponseType = HttpResponse<IConventionEtablissements>;
export type EntityArrayResponseType = HttpResponse<IConventionEtablissements[]>;

@Injectable({ providedIn: 'root' })
export class ConventionEtablissementsService {
  public resourceUrlConventionByEtablissement = this.applicationConfigService.getEndpointForCarriere(
    'api/convention-etablissements/etablissement'
  );
  protected resourceUrl = this.applicationConfigService.getEndpointForCarriere('api/convention-etablissements');

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

  create(conventionEtablissements: IConventionEtablissements): Observable<EntityResponseType> {
    return this.http.post<IConventionEtablissements>(this.resourceUrl, conventionEtablissements, { observe: 'response' });
  }

  update(conventionEtablissements: IConventionEtablissements): Observable<EntityResponseType> {
    return this.http.put<IConventionEtablissements>(
      `${this.resourceUrl}/${getConventionEtablissementsIdentifier(conventionEtablissements) as number}`,
      conventionEtablissements,
      { observe: 'response' }
    );
  }

  partialUpdate(conventionEtablissements: IConventionEtablissements): Observable<EntityResponseType> {
    return this.http.patch<IConventionEtablissements>(
      `${this.resourceUrl}/${getConventionEtablissementsIdentifier(conventionEtablissements) as number}`,
      conventionEtablissements,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IConventionEtablissements>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IConventionEtablissements[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addConventionEtablissementsToCollectionIfMissing(
    conventionEtablissementsCollection: IConventionEtablissements[],
    ...conventionEtablissementsToCheck: (IConventionEtablissements | null | undefined)[]
  ): IConventionEtablissements[] {
    const conventionEtablissements: IConventionEtablissements[] = conventionEtablissementsToCheck.filter(isPresent);
    if (conventionEtablissements.length > 0) {
      const conventionEtablissementsCollectionIdentifiers = conventionEtablissementsCollection.map(
        conventionEtablissementsItem => getConventionEtablissementsIdentifier(conventionEtablissementsItem)!
      );
      const conventionEtablissementsToAdd = conventionEtablissements.filter(conventionEtablissementsItem => {
        const conventionEtablissementsIdentifier = getConventionEtablissementsIdentifier(conventionEtablissementsItem);
        if (
          conventionEtablissementsIdentifier == null ||
          conventionEtablissementsCollectionIdentifiers.includes(conventionEtablissementsIdentifier)
        ) {
          return false;
        }
        conventionEtablissementsCollectionIdentifiers.push(conventionEtablissementsIdentifier);
        return true;
      });
      return [...conventionEtablissementsToAdd, ...conventionEtablissementsCollection];
    }
    return conventionEtablissementsCollection;
  }

  queryConventionByEtablissement(etablissementId: number): Observable<EntityArrayResponseType> {
    const e = new HttpParams().set('etablissementId', `${etablissementId}`);

    return this.http.get<IConventionEtablissements[]>(this.resourceUrlConventionByEtablissement, {
      headers: this.header,
      params: e,
      observe: 'response',
    });
  }
}
