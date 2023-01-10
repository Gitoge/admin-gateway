import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICategorieActes, getCategorieActesIdentifier } from '../categorie-actes.model';

export type EntityResponseType = HttpResponse<ICategorieActes>;
export type EntityArrayResponseType = HttpResponse<ICategorieActes[]>;

@Injectable({ providedIn: 'root' })
export class CategorieActesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/categorie-actes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(categorieActes: ICategorieActes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(categorieActes);
    return this.http
      .post<ICategorieActes>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(categorieActes: ICategorieActes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(categorieActes);
    return this.http
      .put<ICategorieActes>(`${this.resourceUrl}/${getCategorieActesIdentifier(categorieActes) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(categorieActes: ICategorieActes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(categorieActes);
    return this.http
      .patch<ICategorieActes>(`${this.resourceUrl}/${getCategorieActesIdentifier(categorieActes) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICategorieActes>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICategorieActes[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCategorieActesToCollectionIfMissing(
    categorieActesCollection: ICategorieActes[],
    ...categorieActesToCheck: (ICategorieActes | null | undefined)[]
  ): ICategorieActes[] {
    const categorieActes: ICategorieActes[] = categorieActesToCheck.filter(isPresent);
    if (categorieActes.length > 0) {
      const categorieActesCollectionIdentifiers = categorieActesCollection.map(
        categorieActesItem => getCategorieActesIdentifier(categorieActesItem)!
      );
      const categorieActesToAdd = categorieActes.filter(categorieActesItem => {
        const categorieActesIdentifier = getCategorieActesIdentifier(categorieActesItem);
        if (categorieActesIdentifier == null || categorieActesCollectionIdentifiers.includes(categorieActesIdentifier)) {
          return false;
        }
        categorieActesCollectionIdentifiers.push(categorieActesIdentifier);
        return true;
      });
      return [...categorieActesToAdd, ...categorieActesCollection];
    }
    return categorieActesCollection;
  }

  protected convertDateFromClient(categorieActes: ICategorieActes): ICategorieActes {
    return Object.assign({}, categorieActes, {
      userdateInsert: categorieActes.userdateInsert?.isValid() ? categorieActes.userdateInsert.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.userdateInsert = res.body.userdateInsert ? dayjs(res.body.userdateInsert) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((categorieActes: ICategorieActes) => {
        categorieActes.userdateInsert = categorieActes.userdateInsert ? dayjs(categorieActes.userdateInsert) : undefined;
      });
    }
    return res;
  }
}
