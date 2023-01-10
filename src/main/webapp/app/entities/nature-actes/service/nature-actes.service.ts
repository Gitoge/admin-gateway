import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { INatureActes, getNatureActesIdentifier } from '../nature-actes.model';

export type EntityResponseType = HttpResponse<INatureActes>;
export type EntityArrayResponseType = HttpResponse<INatureActes[]>;

@Injectable({ providedIn: 'root' })
export class NatureActesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/nature-actes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(natureActes: INatureActes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(natureActes);
    return this.http
      .post<INatureActes>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(natureActes: INatureActes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(natureActes);
    return this.http
      .put<INatureActes>(`${this.resourceUrl}/${getNatureActesIdentifier(natureActes) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(natureActes: INatureActes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(natureActes);
    return this.http
      .patch<INatureActes>(`${this.resourceUrl}/${getNatureActesIdentifier(natureActes) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<INatureActes>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<INatureActes[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addNatureActesToCollectionIfMissing(
    natureActesCollection: INatureActes[],
    ...natureActesToCheck: (INatureActes | null | undefined)[]
  ): INatureActes[] {
    const natureActes: INatureActes[] = natureActesToCheck.filter(isPresent);
    if (natureActes.length > 0) {
      const natureActesCollectionIdentifiers = natureActesCollection.map(natureActesItem => getNatureActesIdentifier(natureActesItem)!);
      const natureActesToAdd = natureActes.filter(natureActesItem => {
        const natureActesIdentifier = getNatureActesIdentifier(natureActesItem);
        if (natureActesIdentifier == null || natureActesCollectionIdentifiers.includes(natureActesIdentifier)) {
          return false;
        }
        natureActesCollectionIdentifiers.push(natureActesIdentifier);
        return true;
      });
      return [...natureActesToAdd, ...natureActesCollection];
    }
    return natureActesCollection;
  }

  protected convertDateFromClient(natureActes: INatureActes): INatureActes {
    return Object.assign({}, natureActes, {
      userdateInsert: natureActes.userdateInsert?.isValid() ? natureActes.userdateInsert.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((natureActes: INatureActes) => {
        natureActes.userdateInsert = natureActes.userdateInsert ? dayjs(natureActes.userdateInsert) : undefined;
      });
    }
    return res;
  }
}
