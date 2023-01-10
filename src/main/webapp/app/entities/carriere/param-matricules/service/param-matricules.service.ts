import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IParamMatricules, getParamMatriculesIdentifier } from '../param-matricules.model';
import { IAgent } from '../../agent/agent.model';

export type EntityResponseType = HttpResponse<IParamMatricules>;
export type EntityArrayResponseType = HttpResponse<IParamMatricules[]>;

@Injectable({ providedIn: 'root' })
export class ParamMatriculesService {
  protected resourceUrl = this.applicationConfigService.getEndpointForCarriere('api/param-matricules');

  protected resourceUrlMatricule = this.applicationConfigService.getEndpointForCarriere('api/matricules');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(paramMatricules: IParamMatricules): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paramMatricules);
    return this.http
      .post<IParamMatricules>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(paramMatricules: IParamMatricules): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paramMatricules);
    return this.http
      .put<IParamMatricules>(`${this.resourceUrl}/${getParamMatriculesIdentifier(paramMatricules) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(paramMatricules: IParamMatricules): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(paramMatricules);
    return this.http
      .patch<IParamMatricules>(`${this.resourceUrl}/${getParamMatriculesIdentifier(paramMatricules) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IParamMatricules>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findByMatricule(numeroMatricule: string): Observable<EntityResponseType> {
    return this.http
      .get<IParamMatricules>(`${this.resourceUrl}/${numeroMatricule}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IParamMatricules[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  getMatricule(req?: any): any {
    const options = createRequestOption(req);
    return this.http.get<IParamMatricules[]>(this.resourceUrlMatricule, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addParamMatriculesToCollectionIfMissing(
    paramMatriculesCollection: IParamMatricules[],
    ...paramMatriculesToCheck: (IParamMatricules | null | undefined)[]
  ): IParamMatricules[] {
    const paramMatricules: IParamMatricules[] = paramMatriculesToCheck.filter(isPresent);
    if (paramMatricules.length > 0) {
      const paramMatriculesCollectionIdentifiers = paramMatriculesCollection.map(
        paramMatriculesItem => getParamMatriculesIdentifier(paramMatriculesItem)!
      );
      const paramMatriculesToAdd = paramMatricules.filter(paramMatriculesItem => {
        const paramMatriculesIdentifier = getParamMatriculesIdentifier(paramMatriculesItem);
        if (paramMatriculesIdentifier == null || paramMatriculesCollectionIdentifiers.includes(paramMatriculesIdentifier)) {
          return false;
        }
        paramMatriculesCollectionIdentifiers.push(paramMatriculesIdentifier);
        return true;
      });
      return [...paramMatriculesToAdd, ...paramMatriculesCollection];
    }
    return paramMatriculesCollection;
  }

  protected convertDateFromClient(paramMatricules: IParamMatricules): IParamMatricules {
    return Object.assign({}, paramMatricules, {
      datePriseEnCompte: paramMatricules.datePriseEnCompte?.isValid() ? paramMatricules.datePriseEnCompte.format(DATE_FORMAT) : undefined,
      dateInsert: paramMatricules.dateInsert?.isValid() ? paramMatricules.dateInsert.toJSON() : undefined,
      dateUpdate: paramMatricules.dateUpdate?.isValid() ? paramMatricules.dateUpdate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.datePriseEnCompte = res.body.datePriseEnCompte ? dayjs(res.body.datePriseEnCompte) : undefined;
      res.body.dateInsert = res.body.dateInsert ? dayjs(res.body.dateInsert) : undefined;
      res.body.dateUpdate = res.body.dateUpdate ? dayjs(res.body.dateUpdate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((paramMatricules: IParamMatricules) => {
        paramMatricules.datePriseEnCompte = paramMatricules.datePriseEnCompte ? dayjs(paramMatricules.datePriseEnCompte) : undefined;
        paramMatricules.dateInsert = paramMatricules.dateInsert ? dayjs(paramMatricules.dateInsert) : undefined;
        paramMatricules.dateUpdate = paramMatricules.dateUpdate ? dayjs(paramMatricules.dateUpdate) : undefined;
      });
    }
    return res;
  }
}
