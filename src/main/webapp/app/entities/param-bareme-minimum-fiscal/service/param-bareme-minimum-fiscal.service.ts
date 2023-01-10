import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IParamBaremeMinimumFiscal, getParamBaremeMinimumFiscalIdentifier } from '../param-bareme-minimum-fiscal.model';

export type EntityResponseType = HttpResponse<IParamBaremeMinimumFiscal>;
export type EntityArrayResponseType = HttpResponse<IParamBaremeMinimumFiscal[]>;

@Injectable({ providedIn: 'root' })
export class ParamBaremeMinimumFiscalService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/param-bareme-minimum-fiscals');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(paramBaremeMinimumFiscal: IParamBaremeMinimumFiscal): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paramBaremeMinimumFiscal);
    return this.http
      .post<IParamBaremeMinimumFiscal>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(paramBaremeMinimumFiscal: IParamBaremeMinimumFiscal): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paramBaremeMinimumFiscal);
    return this.http
      .put<IParamBaremeMinimumFiscal>(
        `${this.resourceUrl}/${getParamBaremeMinimumFiscalIdentifier(paramBaremeMinimumFiscal) as number}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(paramBaremeMinimumFiscal: IParamBaremeMinimumFiscal): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paramBaremeMinimumFiscal);
    return this.http
      .patch<IParamBaremeMinimumFiscal>(
        `${this.resourceUrl}/${getParamBaremeMinimumFiscalIdentifier(paramBaremeMinimumFiscal) as number}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IParamBaremeMinimumFiscal>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IParamBaremeMinimumFiscal[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addParamBaremeMinimumFiscalToCollectionIfMissing(
    paramBaremeMinimumFiscalCollection: IParamBaremeMinimumFiscal[],
    ...paramBaremeMinimumFiscalsToCheck: (IParamBaremeMinimumFiscal | null | undefined)[]
  ): IParamBaremeMinimumFiscal[] {
    const paramBaremeMinimumFiscals: IParamBaremeMinimumFiscal[] = paramBaremeMinimumFiscalsToCheck.filter(isPresent);
    if (paramBaremeMinimumFiscals.length > 0) {
      const paramBaremeMinimumFiscalCollectionIdentifiers = paramBaremeMinimumFiscalCollection.map(
        paramBaremeMinimumFiscalItem => getParamBaremeMinimumFiscalIdentifier(paramBaremeMinimumFiscalItem)!
      );
      const paramBaremeMinimumFiscalsToAdd = paramBaremeMinimumFiscals.filter(paramBaremeMinimumFiscalItem => {
        const paramBaremeMinimumFiscalIdentifier = getParamBaremeMinimumFiscalIdentifier(paramBaremeMinimumFiscalItem);
        if (
          paramBaremeMinimumFiscalIdentifier == null ||
          paramBaremeMinimumFiscalCollectionIdentifiers.includes(paramBaremeMinimumFiscalIdentifier)
        ) {
          return false;
        }
        paramBaremeMinimumFiscalCollectionIdentifiers.push(paramBaremeMinimumFiscalIdentifier);
        return true;
      });
      return [...paramBaremeMinimumFiscalsToAdd, ...paramBaremeMinimumFiscalCollection];
    }
    return paramBaremeMinimumFiscalCollection;
  }

  protected convertDateFromClient(paramBaremeMinimumFiscal: IParamBaremeMinimumFiscal): IParamBaremeMinimumFiscal {
    return Object.assign({}, paramBaremeMinimumFiscal, {
      dateImpact: paramBaremeMinimumFiscal.dateImpact?.isValid() ? paramBaremeMinimumFiscal.dateImpact.format(DATE_FORMAT) : undefined,
      userdateInsert: paramBaremeMinimumFiscal.userdateInsert?.isValid()
        ? paramBaremeMinimumFiscal.userdateInsert.format(DATE_FORMAT)
        : undefined,
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
      res.body.forEach((paramBaremeMinimumFiscal: IParamBaremeMinimumFiscal) => {
        paramBaremeMinimumFiscal.dateImpact = paramBaremeMinimumFiscal.dateImpact ? dayjs(paramBaremeMinimumFiscal.dateImpact) : undefined;
        paramBaremeMinimumFiscal.userdateInsert = paramBaremeMinimumFiscal.userdateInsert
          ? dayjs(paramBaremeMinimumFiscal.userdateInsert)
          : undefined;
      });
    }
    return res;
  }
}
