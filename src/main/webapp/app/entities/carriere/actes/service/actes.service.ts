import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IActes, getActesIdentifier } from '../actes.model';

export type EntityResponseType = HttpResponse<IActes>;
export type EntityArrayResponseType = HttpResponse<IActes[]>;

@Injectable({ providedIn: 'root' })
export class ActesService {
  protected resourceUrl = this.applicationConfigService.getEndpointForCarriere('api/actes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(actes: IActes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(actes);
    return this.http
      .post<IActes>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(actes: IActes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(actes);
    return this.http
      .put<IActes>(`${this.resourceUrl}/${getActesIdentifier(actes) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(actes: IActes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(actes);
    return this.http
      .patch<IActes>(`${this.resourceUrl}/${getActesIdentifier(actes) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IActes>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IActes[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addActesToCollectionIfMissing(actesCollection: IActes[], ...actesToCheck: (IActes | null | undefined)[]): IActes[] {
    const actes: IActes[] = actesToCheck.filter(isPresent);
    if (actes.length > 0) {
      const actesCollectionIdentifiers = actesCollection.map(actesItem => getActesIdentifier(actesItem)!);
      const actesToAdd = actes.filter(actesItem => {
        const actesIdentifier = getActesIdentifier(actesItem);
        if (actesIdentifier == null || actesCollectionIdentifiers.includes(actesIdentifier)) {
          return false;
        }
        actesCollectionIdentifiers.push(actesIdentifier);
        return true;
      });
      return [...actesToAdd, ...actesCollection];
    }
    return actesCollection;
  }

  protected convertDateFromClient(actes: IActes): IActes {
    return Object.assign({}, actes, {
      dateActe: actes.dateActe?.isValid() ? actes.dateActe.format(DATE_FORMAT) : undefined,
      dateEffet: actes.dateEffet?.isValid() ? actes.dateEffet.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateActe = res.body.dateActe ? dayjs(res.body.dateActe) : undefined;
      res.body.dateEffet = res.body.dateEffet ? dayjs(res.body.dateEffet) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((actes: IActes) => {
        actes.dateActe = actes.dateActe ? dayjs(actes.dateActe) : undefined;
        actes.dateEffet = actes.dateEffet ? dayjs(actes.dateEffet) : undefined;
      });
    }
    return res;
  }
}
