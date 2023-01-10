import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICategorie, getCategorieIdentifier } from '../categorie.model';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';

export type EntityResponseType = HttpResponse<ICategorie>;
export type EntityArrayResponseType = HttpResponse<ICategorie[]>;

@Injectable({ providedIn: 'root' })
export class CategorieService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/categories');

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

  create(categorie: ICategorie): Observable<EntityResponseType> {
    return this.http.post<ICategorie>(this.resourceUrl, categorie, { observe: 'response' });
  }

  update(categorie: ICategorie): Observable<EntityResponseType> {
    return this.http.put<ICategorie>(`${this.resourceUrl}/${getCategorieIdentifier(categorie) as number}`, categorie, {
      observe: 'response',
    });
  }

  partialUpdate(categorie: ICategorie): Observable<EntityResponseType> {
    return this.http.patch<ICategorie>(`${this.resourceUrl}/${getCategorieIdentifier(categorie) as number}`, categorie, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICategorie>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findAll(): Observable<EntityArrayResponseType> {
    return this.http.get<ICategorie[]>(`${this.resourceUrl}/all`, { headers: this.header, observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICategorie[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCategorieToCollectionIfMissing(
    categorieCollection: ICategorie[],
    ...categoriesToCheck: (ICategorie | null | undefined)[]
  ): ICategorie[] {
    const categories: ICategorie[] = categoriesToCheck.filter(isPresent);
    if (categories.length > 0) {
      const categorieCollectionIdentifiers = categorieCollection.map(categorieItem => getCategorieIdentifier(categorieItem)!);
      const categoriesToAdd = categories.filter(categorieItem => {
        const categorieIdentifier = getCategorieIdentifier(categorieItem);
        if (categorieIdentifier == null || categorieCollectionIdentifiers.includes(categorieIdentifier)) {
          return false;
        }
        categorieCollectionIdentifiers.push(categorieIdentifier);
        return true;
      });
      return [...categoriesToAdd, ...categorieCollection];
    }
    return categorieCollection;
  }
}
