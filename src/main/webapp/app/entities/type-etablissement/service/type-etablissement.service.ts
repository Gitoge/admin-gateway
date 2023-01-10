import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITypeEtablissement, getTypeEtablissementIdentifier } from '../type-etablissement.model';
import { SERVER_API_URL_BACKEND } from 'app/app.constants';

export type EntityResponseType = HttpResponse<ITypeEtablissement>;
export type EntityArrayResponseType = HttpResponse<ITypeEtablissement[]>;

@Injectable({ providedIn: 'root' })
export class TypeEtablissementService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/type-etablissements');
  protected resourceUrlTypeEtablissementRecherche = SERVER_API_URL_BACKEND + 'api/type-etablissements/recherchemotsclés';

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(typeEtablissement: ITypeEtablissement): Observable<EntityResponseType> {
    return this.http.post<ITypeEtablissement>(this.resourceUrl, typeEtablissement, { observe: 'response' });
  }

  update(typeEtablissement: ITypeEtablissement): Observable<EntityResponseType> {
    return this.http.put<ITypeEtablissement>(
      `${this.resourceUrl}/${getTypeEtablissementIdentifier(typeEtablissement) as number}`,
      typeEtablissement,
      { observe: 'response' }
    );
  }

  partialUpdate(typeEtablissement: ITypeEtablissement): Observable<EntityResponseType> {
    return this.http.patch<ITypeEtablissement>(
      `${this.resourceUrl}/${getTypeEtablissementIdentifier(typeEtablissement) as number}`,
      typeEtablissement,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITypeEtablissement>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findTypeEtablissementByMotsCles(motCles: string, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITypeEtablissement[]>(`${this.resourceUrlTypeEtablissementRecherche}?motCles=${motCles}`, {
      params: options,
      observe: 'response',
    });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITypeEtablissement[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTypeEtablissementToCollectionIfMissing(
    typeEtablissementCollection: ITypeEtablissement[],
    ...typeEtablissementsToCheck: (ITypeEtablissement | null | undefined)[]
  ): ITypeEtablissement[] {
    const typeEtablissements: ITypeEtablissement[] = typeEtablissementsToCheck.filter(isPresent);
    if (typeEtablissements.length > 0) {
      const typeEtablissementCollectionIdentifiers = typeEtablissementCollection.map(
        typeEtablissementItem => getTypeEtablissementIdentifier(typeEtablissementItem)!
      );
      const typeEtablissementsToAdd = typeEtablissements.filter(typeEtablissementItem => {
        const typeEtablissementIdentifier = getTypeEtablissementIdentifier(typeEtablissementItem);
        if (typeEtablissementIdentifier == null || typeEtablissementCollectionIdentifiers.includes(typeEtablissementIdentifier)) {
          return false;
        }
        typeEtablissementCollectionIdentifiers.push(typeEtablissementIdentifier);
        return true;
      });
      return [...typeEtablissementsToAdd, ...typeEtablissementCollection];
    }
    return typeEtablissementCollection;
  }
}
