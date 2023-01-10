import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IParamPartsFiscales, getParamPartsFiscalesIdentifier } from '../param-parts-fiscales.model';

export type EntityResponseType = HttpResponse<IParamPartsFiscales>;
export type EntityArrayResponseType = HttpResponse<IParamPartsFiscales[]>;

@Injectable({ providedIn: 'root' })
export class ParamPartsFiscalesService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/param-parts-fiscales');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(paramPartsFiscales: IParamPartsFiscales): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paramPartsFiscales);
    return this.http
      .post<IParamPartsFiscales>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(paramPartsFiscales: IParamPartsFiscales): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paramPartsFiscales);
    return this.http
      .put<IParamPartsFiscales>(`${this.resourceUrl}/${getParamPartsFiscalesIdentifier(paramPartsFiscales) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(paramPartsFiscales: IParamPartsFiscales): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paramPartsFiscales);
    return this.http
      .patch<IParamPartsFiscales>(`${this.resourceUrl}/${getParamPartsFiscalesIdentifier(paramPartsFiscales) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IParamPartsFiscales>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IParamPartsFiscales[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addParamPartsFiscalesToCollectionIfMissing(
    paramPartsFiscalesCollection: IParamPartsFiscales[],
    ...paramPartsFiscalesToCheck: (IParamPartsFiscales | null | undefined)[]
  ): IParamPartsFiscales[] {
    const paramPartsFiscales: IParamPartsFiscales[] = paramPartsFiscalesToCheck.filter(isPresent);
    if (paramPartsFiscales.length > 0) {
      const paramPartsFiscalesCollectionIdentifiers = paramPartsFiscalesCollection.map(
        paramPartsFiscalesItem => getParamPartsFiscalesIdentifier(paramPartsFiscalesItem)!
      );
      const paramPartsFiscalesToAdd = paramPartsFiscales.filter(paramPartsFiscalesItem => {
        const paramPartsFiscalesIdentifier = getParamPartsFiscalesIdentifier(paramPartsFiscalesItem);
        if (paramPartsFiscalesIdentifier == null || paramPartsFiscalesCollectionIdentifiers.includes(paramPartsFiscalesIdentifier)) {
          return false;
        }
        paramPartsFiscalesCollectionIdentifiers.push(paramPartsFiscalesIdentifier);
        return true;
      });
      return [...paramPartsFiscalesToAdd, ...paramPartsFiscalesCollection];
    }
    return paramPartsFiscalesCollection;
  }

  protected convertDateFromClient(paramPartsFiscales: IParamPartsFiscales): IParamPartsFiscales {
    return Object.assign({}, paramPartsFiscales, {
      userdateInsert: paramPartsFiscales.userdateInsert?.isValid() ? paramPartsFiscales.userdateInsert.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((paramPartsFiscales: IParamPartsFiscales) => {
        paramPartsFiscales.userdateInsert = paramPartsFiscales.userdateInsert ? dayjs(paramPartsFiscales.userdateInsert) : undefined;
      });
    }
    return res;
  }
}
