import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITypeReglement, getTypeReglementIdentifier } from '../type-reglement.model';

export type EntityResponseType = HttpResponse<ITypeReglement>;
export type EntityArrayResponseType = HttpResponse<ITypeReglement[]>;

@Injectable({ providedIn: 'root' })
export class TypeReglementService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/type-reglements');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(typeReglement: ITypeReglement): Observable<EntityResponseType> {
    return this.http.post<ITypeReglement>(this.resourceUrl, typeReglement, { observe: 'response' });
  }

  update(typeReglement: ITypeReglement): Observable<EntityResponseType> {
    return this.http.put<ITypeReglement>(`${this.resourceUrl}/${getTypeReglementIdentifier(typeReglement) as number}`, typeReglement, {
      observe: 'response',
    });
  }

  partialUpdate(typeReglement: ITypeReglement): Observable<EntityResponseType> {
    return this.http.patch<ITypeReglement>(`${this.resourceUrl}/${getTypeReglementIdentifier(typeReglement) as number}`, typeReglement, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITypeReglement>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITypeReglement[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTypeReglementToCollectionIfMissing(
    typeReglementCollection: ITypeReglement[],
    ...typeReglementsToCheck: (ITypeReglement | null | undefined)[]
  ): ITypeReglement[] {
    const typeReglements: ITypeReglement[] = typeReglementsToCheck.filter(isPresent);
    if (typeReglements.length > 0) {
      const typeReglementCollectionIdentifiers = typeReglementCollection.map(
        typeReglementItem => getTypeReglementIdentifier(typeReglementItem)!
      );
      const typeReglementsToAdd = typeReglements.filter(typeReglementItem => {
        const typeReglementIdentifier = getTypeReglementIdentifier(typeReglementItem);
        if (typeReglementIdentifier == null || typeReglementCollectionIdentifiers.includes(typeReglementIdentifier)) {
          return false;
        }
        typeReglementCollectionIdentifiers.push(typeReglementIdentifier);
        return true;
      });
      return [...typeReglementsToAdd, ...typeReglementCollection];
    }
    return typeReglementCollection;
  }
}
