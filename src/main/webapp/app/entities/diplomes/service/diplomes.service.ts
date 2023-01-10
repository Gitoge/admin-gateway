import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDiplomes, getDiplomesIdentifier } from '../diplomes.model';

export type EntityResponseType = HttpResponse<IDiplomes>;
export type EntityArrayResponseType = HttpResponse<IDiplomes[]>;

@Injectable({ providedIn: 'root' })
export class DiplomesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/diplomes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(diplomes: IDiplomes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(diplomes);
    return this.http
      .post<IDiplomes>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(diplomes: IDiplomes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(diplomes);
    return this.http
      .put<IDiplomes>(`${this.resourceUrl}/${getDiplomesIdentifier(diplomes) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(diplomes: IDiplomes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(diplomes);
    return this.http
      .patch<IDiplomes>(`${this.resourceUrl}/${getDiplomesIdentifier(diplomes) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDiplomes>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDiplomes[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDiplomesToCollectionIfMissing(diplomesCollection: IDiplomes[], ...diplomesToCheck: (IDiplomes | null | undefined)[]): IDiplomes[] {
    const diplomes: IDiplomes[] = diplomesToCheck.filter(isPresent);
    if (diplomes.length > 0) {
      const diplomesCollectionIdentifiers = diplomesCollection.map(diplomesItem => getDiplomesIdentifier(diplomesItem)!);
      const diplomesToAdd = diplomes.filter(diplomesItem => {
        const diplomesIdentifier = getDiplomesIdentifier(diplomesItem);
        if (diplomesIdentifier == null || diplomesCollectionIdentifiers.includes(diplomesIdentifier)) {
          return false;
        }
        diplomesCollectionIdentifiers.push(diplomesIdentifier);
        return true;
      });
      return [...diplomesToAdd, ...diplomesCollection];
    }
    return diplomesCollection;
  }

  protected convertDateFromClient(diplomes: IDiplomes): IDiplomes {
    return Object.assign({}, diplomes, {
      userdateInsert: diplomes.userdateInsert?.isValid() ? diplomes.userdateInsert.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((diplomes: IDiplomes) => {
        diplomes.userdateInsert = diplomes.userdateInsert ? dayjs(diplomes.userdateInsert) : undefined;
      });
    }
    return res;
  }
}
