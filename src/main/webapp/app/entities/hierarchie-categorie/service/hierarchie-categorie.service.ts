import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHierarchieCategorie, getHierarchieCategorieIdentifier } from '../hierarchie-categorie.model';

export type EntityResponseType = HttpResponse<IHierarchieCategorie>;
export type EntityArrayResponseType = HttpResponse<IHierarchieCategorie[]>;

@Injectable({ providedIn: 'root' })
export class HierarchieCategorieService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/hierarchie-categories');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(hierarchieCategorie: IHierarchieCategorie): Observable<EntityResponseType> {
    return this.http.post<IHierarchieCategorie>(this.resourceUrl, hierarchieCategorie, { observe: 'response' });
  }

  update(hierarchieCategorie: IHierarchieCategorie): Observable<EntityResponseType> {
    return this.http.put<IHierarchieCategorie>(
      `${this.resourceUrl}/${getHierarchieCategorieIdentifier(hierarchieCategorie) as number}`,
      hierarchieCategorie,
      { observe: 'response' }
    );
  }

  partialUpdate(hierarchieCategorie: IHierarchieCategorie): Observable<EntityResponseType> {
    return this.http.patch<IHierarchieCategorie>(
      `${this.resourceUrl}/${getHierarchieCategorieIdentifier(hierarchieCategorie) as number}`,
      hierarchieCategorie,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IHierarchieCategorie>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IHierarchieCategorie[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addHierarchieCategorieToCollectionIfMissing(
    hierarchieCategorieCollection: IHierarchieCategorie[],
    ...hierarchieCategoriesToCheck: (IHierarchieCategorie | null | undefined)[]
  ): IHierarchieCategorie[] {
    const hierarchieCategories: IHierarchieCategorie[] = hierarchieCategoriesToCheck.filter(isPresent);
    if (hierarchieCategories.length > 0) {
      const hierarchieCategorieCollectionIdentifiers = hierarchieCategorieCollection.map(
        hierarchieCategorieItem => getHierarchieCategorieIdentifier(hierarchieCategorieItem)!
      );
      const hierarchieCategoriesToAdd = hierarchieCategories.filter(hierarchieCategorieItem => {
        const hierarchieCategorieIdentifier = getHierarchieCategorieIdentifier(hierarchieCategorieItem);
        if (hierarchieCategorieIdentifier == null || hierarchieCategorieCollectionIdentifiers.includes(hierarchieCategorieIdentifier)) {
          return false;
        }
        hierarchieCategorieCollectionIdentifiers.push(hierarchieCategorieIdentifier);
        return true;
      });
      return [...hierarchieCategoriesToAdd, ...hierarchieCategorieCollection];
    }
    return hierarchieCategorieCollection;
  }
}
