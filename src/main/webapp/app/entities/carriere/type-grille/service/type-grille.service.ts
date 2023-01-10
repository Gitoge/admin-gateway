import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITypeGrille, getTypeGrilleIdentifier } from '../type-grille.model';

export type EntityResponseType = HttpResponse<ITypeGrille>;
export type EntityArrayResponseType = HttpResponse<ITypeGrille[]>;

@Injectable({ providedIn: 'root' })
export class TypeGrilleService {
  protected resourceUrl = this.applicationConfigService.getEndpointForCarriere('api/type-grilles');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(typeGrille: ITypeGrille): Observable<EntityResponseType> {
    return this.http.post<ITypeGrille>(this.resourceUrl, typeGrille, { observe: 'response' });
  }

  update(typeGrille: ITypeGrille): Observable<EntityResponseType> {
    return this.http.put<ITypeGrille>(`${this.resourceUrl}/${getTypeGrilleIdentifier(typeGrille) as number}`, typeGrille, {
      observe: 'response',
    });
  }

  partialUpdate(typeGrille: ITypeGrille): Observable<EntityResponseType> {
    return this.http.patch<ITypeGrille>(`${this.resourceUrl}/${getTypeGrilleIdentifier(typeGrille) as number}`, typeGrille, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITypeGrille>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITypeGrille[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTypeGrilleToCollectionIfMissing(
    typeGrilleCollection: ITypeGrille[],
    ...typeGrillesToCheck: (ITypeGrille | null | undefined)[]
  ): ITypeGrille[] {
    const typeGrilles: ITypeGrille[] = typeGrillesToCheck.filter(isPresent);
    if (typeGrilles.length > 0) {
      const typeGrilleCollectionIdentifiers = typeGrilleCollection.map(typeGrilleItem => getTypeGrilleIdentifier(typeGrilleItem)!);
      const typeGrillesToAdd = typeGrilles.filter(typeGrilleItem => {
        const typeGrilleIdentifier = getTypeGrilleIdentifier(typeGrilleItem);
        if (typeGrilleIdentifier == null || typeGrilleCollectionIdentifiers.includes(typeGrilleIdentifier)) {
          return false;
        }
        typeGrilleCollectionIdentifiers.push(typeGrilleIdentifier);
        return true;
      });
      return [...typeGrillesToAdd, ...typeGrilleCollection];
    }
    return typeGrilleCollection;
  }
}
