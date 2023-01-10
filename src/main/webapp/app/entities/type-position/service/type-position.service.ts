import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITypePosition, getTypePositionIdentifier } from '../type-position.model';

export type EntityResponseType = HttpResponse<ITypePosition>;
export type EntityArrayResponseType = HttpResponse<ITypePosition[]>;

@Injectable({ providedIn: 'root' })
export class TypePositionService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/type-positions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(typePosition: ITypePosition): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(typePosition);
    return this.http
      .post<ITypePosition>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(typePosition: ITypePosition): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(typePosition);
    return this.http
      .put<ITypePosition>(`${this.resourceUrl}/${getTypePositionIdentifier(typePosition) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(typePosition: ITypePosition): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(typePosition);
    return this.http
      .patch<ITypePosition>(`${this.resourceUrl}/${getTypePositionIdentifier(typePosition) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ITypePosition>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ITypePosition[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTypePositionToCollectionIfMissing(
    typePositionCollection: ITypePosition[],
    ...typePositionsToCheck: (ITypePosition | null | undefined)[]
  ): ITypePosition[] {
    const typePositions: ITypePosition[] = typePositionsToCheck.filter(isPresent);
    if (typePositions.length > 0) {
      const typePositionCollectionIdentifiers = typePositionCollection.map(
        typePositionItem => getTypePositionIdentifier(typePositionItem)!
      );
      const typePositionsToAdd = typePositions.filter(typePositionItem => {
        const typePositionIdentifier = getTypePositionIdentifier(typePositionItem);
        if (typePositionIdentifier == null || typePositionCollectionIdentifiers.includes(typePositionIdentifier)) {
          return false;
        }
        typePositionCollectionIdentifiers.push(typePositionIdentifier);
        return true;
      });
      return [...typePositionsToAdd, ...typePositionCollection];
    }
    return typePositionCollection;
  }

  protected convertDateFromClient(typePosition: ITypePosition): ITypePosition {
    return Object.assign({}, typePosition, {
      userdateInsert: typePosition.userdateInsert?.isValid() ? typePosition.userdateInsert.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((typePosition: ITypePosition) => {
        typePosition.userdateInsert = typePosition.userdateInsert ? dayjs(typePosition.userdateInsert) : undefined;
      });
    }
    return res;
  }
}
