import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITypeActes, getTypeActesIdentifier } from '../type-actes.model';
export type EntityResponseType = HttpResponse<ITypeActes>;
export type EntityArrayResponseType = HttpResponse<ITypeActes[]>;

@Injectable({ providedIn: 'root' })
export class TypeActesService {
  protected resourceUrlEvenement = this.applicationConfigService.getEndpointForCarriere('api/typeActesByEvenement');
  protected resourceUrl = this.applicationConfigService.getEndpointForCarriere('api/type-actes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(typeActes: ITypeActes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(typeActes);
    return this.http
      .post<ITypeActes>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(typeActes: ITypeActes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(typeActes);
    return this.http
      .put<ITypeActes>(`${this.resourceUrl}/${getTypeActesIdentifier(typeActes) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(typeActes: ITypeActes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(typeActes);
    return this.http
      .patch<ITypeActes>(`${this.resourceUrl}/${getTypeActesIdentifier(typeActes) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ITypeActes>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ITypeActes[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  findByEvenement(evenementId: number): Observable<EntityArrayResponseType> {
    return this.http.get<ITypeActes[]>(`${this.resourceUrlEvenement}?evenementId=${evenementId}`, {
      observe: 'response',
    });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTypeActesToCollectionIfMissing(
    typeActesCollection: ITypeActes[],
    ...typeActesToCheck: (ITypeActes | null | undefined)[]
  ): ITypeActes[] {
    const typeActes: ITypeActes[] = typeActesToCheck.filter(isPresent);
    if (typeActes.length > 0) {
      const typeActesCollectionIdentifiers = typeActesCollection.map(typeActesItem => getTypeActesIdentifier(typeActesItem)!);
      const typeActesToAdd = typeActes.filter(typeActesItem => {
        const typeActesIdentifier = getTypeActesIdentifier(typeActesItem);
        if (typeActesIdentifier == null || typeActesCollectionIdentifiers.includes(typeActesIdentifier)) {
          return false;
        }
        typeActesCollectionIdentifiers.push(typeActesIdentifier);
        return true;
      });
      return [...typeActesToAdd, ...typeActesCollection];
    }
    return typeActesCollection;
  }

  protected convertDateFromClient(typeActes: ITypeActes): ITypeActes {
    return Object.assign({}, typeActes, {
      userdateInsert: typeActes.userdateInsert?.isValid() ? typeActes.userdateInsert.toJSON() : undefined,
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
      res.body.forEach((typeActes: ITypeActes) => {
        typeActes.userdateInsert = typeActes.userdateInsert ? dayjs(typeActes.userdateInsert) : undefined;
      });
    }
    return res;
  }
}
