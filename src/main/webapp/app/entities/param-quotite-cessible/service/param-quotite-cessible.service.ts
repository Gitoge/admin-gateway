import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IParamQuotiteCessible, getParamQuotiteCessibleIdentifier } from '../param-quotite-cessible.model';

export type EntityResponseType = HttpResponse<IParamQuotiteCessible>;
export type EntityArrayResponseType = HttpResponse<IParamQuotiteCessible[]>;

@Injectable({ providedIn: 'root' })
export class ParamQuotiteCessibleService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/param-quotite-cessibles');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(paramQuotiteCessible: IParamQuotiteCessible): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paramQuotiteCessible);
    return this.http
      .post<IParamQuotiteCessible>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(paramQuotiteCessible: IParamQuotiteCessible): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paramQuotiteCessible);
    return this.http
      .put<IParamQuotiteCessible>(`${this.resourceUrl}/${getParamQuotiteCessibleIdentifier(paramQuotiteCessible) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(paramQuotiteCessible: IParamQuotiteCessible): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paramQuotiteCessible);
    return this.http
      .patch<IParamQuotiteCessible>(`${this.resourceUrl}/${getParamQuotiteCessibleIdentifier(paramQuotiteCessible) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IParamQuotiteCessible>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IParamQuotiteCessible[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addParamQuotiteCessibleToCollectionIfMissing(
    paramQuotiteCessibleCollection: IParamQuotiteCessible[],
    ...paramQuotiteCessiblesToCheck: (IParamQuotiteCessible | null | undefined)[]
  ): IParamQuotiteCessible[] {
    const paramQuotiteCessibles: IParamQuotiteCessible[] = paramQuotiteCessiblesToCheck.filter(isPresent);
    if (paramQuotiteCessibles.length > 0) {
      const paramQuotiteCessibleCollectionIdentifiers = paramQuotiteCessibleCollection.map(
        paramQuotiteCessibleItem => getParamQuotiteCessibleIdentifier(paramQuotiteCessibleItem)!
      );
      const paramQuotiteCessiblesToAdd = paramQuotiteCessibles.filter(paramQuotiteCessibleItem => {
        const paramQuotiteCessibleIdentifier = getParamQuotiteCessibleIdentifier(paramQuotiteCessibleItem);
        if (paramQuotiteCessibleIdentifier == null || paramQuotiteCessibleCollectionIdentifiers.includes(paramQuotiteCessibleIdentifier)) {
          return false;
        }
        paramQuotiteCessibleCollectionIdentifiers.push(paramQuotiteCessibleIdentifier);
        return true;
      });
      return [...paramQuotiteCessiblesToAdd, ...paramQuotiteCessibleCollection];
    }
    return paramQuotiteCessibleCollection;
  }

  protected convertDateFromClient(paramQuotiteCessible: IParamQuotiteCessible): IParamQuotiteCessible {
    return Object.assign({}, paramQuotiteCessible, {
      dateImpact: paramQuotiteCessible.dateImpact?.isValid() ? paramQuotiteCessible.dateImpact.format(DATE_FORMAT) : undefined,
      userdateInsert: paramQuotiteCessible.userdateInsert?.isValid() ? paramQuotiteCessible.userdateInsert.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateImpact = res.body.dateImpact ? dayjs(res.body.dateImpact) : undefined;
      res.body.userdateInsert = res.body.userdateInsert ? dayjs(res.body.userdateInsert) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((paramQuotiteCessible: IParamQuotiteCessible) => {
        paramQuotiteCessible.dateImpact = paramQuotiteCessible.dateImpact ? dayjs(paramQuotiteCessible.dateImpact) : undefined;
        paramQuotiteCessible.userdateInsert = paramQuotiteCessible.userdateInsert ? dayjs(paramQuotiteCessible.userdateInsert) : undefined;
      });
    }
    return res;
  }
}
