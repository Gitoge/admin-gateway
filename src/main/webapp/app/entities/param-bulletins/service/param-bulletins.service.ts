import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IParamBulletins, getParamBulletinsIdentifier } from '../param-bulletins.model';

export type EntityResponseType = HttpResponse<IParamBulletins>;
export type EntityArrayResponseType = HttpResponse<IParamBulletins[]>;

@Injectable({ providedIn: 'root' })
export class ParamBulletinsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/param-bulletins');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(paramBulletins: IParamBulletins): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paramBulletins);
    return this.http
      .post<IParamBulletins>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(paramBulletins: IParamBulletins): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paramBulletins);
    return this.http
      .put<IParamBulletins>(`${this.resourceUrl}/${getParamBulletinsIdentifier(paramBulletins) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(paramBulletins: IParamBulletins): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paramBulletins);
    return this.http
      .patch<IParamBulletins>(`${this.resourceUrl}/${getParamBulletinsIdentifier(paramBulletins) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IParamBulletins>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IParamBulletins[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addParamBulletinsToCollectionIfMissing(
    paramBulletinsCollection: IParamBulletins[],
    ...paramBulletinsToCheck: (IParamBulletins | null | undefined)[]
  ): IParamBulletins[] {
    const paramBulletins: IParamBulletins[] = paramBulletinsToCheck.filter(isPresent);
    if (paramBulletins.length > 0) {
      const paramBulletinsCollectionIdentifiers = paramBulletinsCollection.map(
        paramBulletinsItem => getParamBulletinsIdentifier(paramBulletinsItem)!
      );
      const paramBulletinsToAdd = paramBulletins.filter(paramBulletinsItem => {
        const paramBulletinsIdentifier = getParamBulletinsIdentifier(paramBulletinsItem);
        if (paramBulletinsIdentifier == null || paramBulletinsCollectionIdentifiers.includes(paramBulletinsIdentifier)) {
          return false;
        }
        paramBulletinsCollectionIdentifiers.push(paramBulletinsIdentifier);
        return true;
      });
      return [...paramBulletinsToAdd, ...paramBulletinsCollection];
    }
    return paramBulletinsCollection;
  }

  protected convertDateFromClient(paramBulletins: IParamBulletins): IParamBulletins {
    return Object.assign({}, paramBulletins, {
      userdateInsert: paramBulletins.userdateInsert?.isValid() ? paramBulletins.userdateInsert.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((paramBulletins: IParamBulletins) => {
        paramBulletins.userdateInsert = paramBulletins.userdateInsert ? dayjs(paramBulletins.userdateInsert) : undefined;
      });
    }
    return res;
  }
}
