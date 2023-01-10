import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { INationalite, getNationaliteIdentifier } from '../nationalite.model';

export type EntityResponseType = HttpResponse<INationalite>;
export type EntityArrayResponseType = HttpResponse<INationalite[]>;

@Injectable({ providedIn: 'root' })
export class NationaliteService {
  //protected resourceUrl = this.applicationConfigService.getEndpointFor('api/nationalites', 'carriere');
  protected resourceUrl = this.applicationConfigService.getEndpointForCarriere('api/nationalites');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(nationalite: INationalite): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(nationalite);
    return this.http
      .post<INationalite>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(nationalite: INationalite): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(nationalite);
    return this.http
      .put<INationalite>(`${this.resourceUrl}/${getNationaliteIdentifier(nationalite) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(nationalite: INationalite): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(nationalite);
    return this.http
      .patch<INationalite>(`${this.resourceUrl}/${getNationaliteIdentifier(nationalite) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<INationalite>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<INationalite[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addNationaliteToCollectionIfMissing(
    nationaliteCollection: INationalite[],
    ...nationalitesToCheck: (INationalite | null | undefined)[]
  ): INationalite[] {
    const nationalites: INationalite[] = nationalitesToCheck.filter(isPresent);
    if (nationalites.length > 0) {
      const nationaliteCollectionIdentifiers = nationaliteCollection.map(nationaliteItem => getNationaliteIdentifier(nationaliteItem)!);
      const nationalitesToAdd = nationalites.filter(nationaliteItem => {
        const nationaliteIdentifier = getNationaliteIdentifier(nationaliteItem);
        if (nationaliteIdentifier == null || nationaliteCollectionIdentifiers.includes(nationaliteIdentifier)) {
          return false;
        }
        nationaliteCollectionIdentifiers.push(nationaliteIdentifier);
        return true;
      });
      return [...nationalitesToAdd, ...nationaliteCollection];
    }
    return nationaliteCollection;
  }

  protected convertDateFromClient(nationalite: INationalite): INationalite {
    return Object.assign({}, nationalite, {
      dateInsert: nationalite.dateInsert?.isValid() ? nationalite.dateInsert.toJSON() : undefined,
      dateUpdate: nationalite.dateUpdate?.isValid() ? nationalite.dateUpdate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateInsert = res.body.dateInsert ? dayjs(res.body.dateInsert) : undefined;
      res.body.dateUpdate = res.body.dateUpdate ? dayjs(res.body.dateUpdate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((nationalite: INationalite) => {
        nationalite.dateInsert = nationalite.dateInsert ? dayjs(nationalite.dateInsert) : undefined;
        nationalite.dateUpdate = nationalite.dateUpdate ? dayjs(nationalite.dateUpdate) : undefined;
      });
    }
    return res;
  }
}
