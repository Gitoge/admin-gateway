import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IParamBaremeImposable, getParamBaremeImposableIdentifier } from '../param-bareme-imposable.model';

export type EntityResponseType = HttpResponse<IParamBaremeImposable>;
export type EntityArrayResponseType = HttpResponse<IParamBaremeImposable[]>;

@Injectable({ providedIn: 'root' })
export class ParamBaremeImposableService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/param-bareme-imposables');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(paramBaremeImposable: IParamBaremeImposable): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paramBaremeImposable);
    return this.http
      .post<IParamBaremeImposable>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(paramBaremeImposable: IParamBaremeImposable): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paramBaremeImposable);
    return this.http
      .put<IParamBaremeImposable>(`${this.resourceUrl}/${getParamBaremeImposableIdentifier(paramBaremeImposable) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(paramBaremeImposable: IParamBaremeImposable): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paramBaremeImposable);
    return this.http
      .patch<IParamBaremeImposable>(`${this.resourceUrl}/${getParamBaremeImposableIdentifier(paramBaremeImposable) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IParamBaremeImposable>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IParamBaremeImposable[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addParamBaremeImposableToCollectionIfMissing(
    paramBaremeImposableCollection: IParamBaremeImposable[],
    ...paramBaremeImposablesToCheck: (IParamBaremeImposable | null | undefined)[]
  ): IParamBaremeImposable[] {
    const paramBaremeImposables: IParamBaremeImposable[] = paramBaremeImposablesToCheck.filter(isPresent);
    if (paramBaremeImposables.length > 0) {
      const paramBaremeImposableCollectionIdentifiers = paramBaremeImposableCollection.map(
        paramBaremeImposableItem => getParamBaremeImposableIdentifier(paramBaremeImposableItem)!
      );
      const paramBaremeImposablesToAdd = paramBaremeImposables.filter(paramBaremeImposableItem => {
        const paramBaremeImposableIdentifier = getParamBaremeImposableIdentifier(paramBaremeImposableItem);
        if (paramBaremeImposableIdentifier == null || paramBaremeImposableCollectionIdentifiers.includes(paramBaremeImposableIdentifier)) {
          return false;
        }
        paramBaremeImposableCollectionIdentifiers.push(paramBaremeImposableIdentifier);
        return true;
      });
      return [...paramBaremeImposablesToAdd, ...paramBaremeImposableCollection];
    }
    return paramBaremeImposableCollection;
  }

  protected convertDateFromClient(paramBaremeImposable: IParamBaremeImposable): IParamBaremeImposable {
    return Object.assign({}, paramBaremeImposable, {
      dateImpact: paramBaremeImposable.dateImpact?.isValid() ? paramBaremeImposable.dateImpact.format(DATE_FORMAT) : undefined,
      userdateInsert: paramBaremeImposable.userdateInsert?.isValid() ? paramBaremeImposable.userdateInsert.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((paramBaremeImposable: IParamBaremeImposable) => {
        paramBaremeImposable.dateImpact = paramBaremeImposable.dateImpact ? dayjs(paramBaremeImposable.dateImpact) : undefined;
        paramBaremeImposable.userdateInsert = paramBaremeImposable.userdateInsert ? dayjs(paramBaremeImposable.userdateInsert) : undefined;
      });
    }
    return res;
  }
}
