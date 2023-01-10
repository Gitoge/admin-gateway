import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT, DATE_FORMAT_FR } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISaisieEmoluments, getSaisieEmolumentsIdentifier } from '../saisie-emoluments.model';
import { IEmoluments } from '../../emoluments/emoluments.model';

export type EntityResponseType = HttpResponse<ISaisieEmoluments>;
export type EntityArrayResponseType = HttpResponse<ISaisieEmoluments[]>;

@Injectable({ providedIn: 'root' })
export class SaisieEmolumentsService {
  protected resourceUrl = this.applicationConfigService.getEndpointForPaie('api/saisie-emoluments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(saisieEmoluments: ISaisieEmoluments): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(saisieEmoluments);
    return this.http
      .post<ISaisieEmoluments>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(saisieEmoluments: ISaisieEmoluments): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(saisieEmoluments);
    return this.http
      .put<ISaisieEmoluments>(`${this.resourceUrl}/${getSaisieEmolumentsIdentifier(saisieEmoluments) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(saisieEmoluments: ISaisieEmoluments): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(saisieEmoluments);
    return this.http
      .patch<ISaisieEmoluments>(`${this.resourceUrl}/${getSaisieEmolumentsIdentifier(saisieEmoluments) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ISaisieEmoluments>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISaisieEmoluments[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSaisieEmolumentsToCollectionIfMissing(
    saisieEmolumentsCollection: ISaisieEmoluments[],
    ...saisieEmolumentsToCheck: (ISaisieEmoluments | null | undefined)[]
  ): ISaisieEmoluments[] {
    const saisieEmoluments: ISaisieEmoluments[] = saisieEmolumentsToCheck.filter(isPresent);
    if (saisieEmoluments.length > 0) {
      const saisieEmolumentsCollectionIdentifiers = saisieEmolumentsCollection.map(
        saisieEmolumentsItem => getSaisieEmolumentsIdentifier(saisieEmolumentsItem)!
      );
      const saisieEmolumentsToAdd = saisieEmoluments.filter(saisieEmolumentsItem => {
        const saisieEmolumentsIdentifier = getSaisieEmolumentsIdentifier(saisieEmolumentsItem);
        if (saisieEmolumentsIdentifier == null || saisieEmolumentsCollectionIdentifiers.includes(saisieEmolumentsIdentifier)) {
          return false;
        }
        saisieEmolumentsCollectionIdentifiers.push(saisieEmolumentsIdentifier);
        return true;
      });
      return [...saisieEmolumentsToAdd, ...saisieEmolumentsCollection];
    }
    return saisieEmolumentsCollection;
  }

  protected convertDateFromClient(emoluments: IEmoluments): IEmoluments {
    return Object.assign({}, emoluments, {
      dateEffet: emoluments.dateEffet ? emoluments.dateEffet : undefined,
      dateEcheance: emoluments.dateEcheance ? emoluments.dateEcheance : undefined,
      dateInsert: emoluments.dateInsert?.isValid() ? emoluments.dateInsert.toJSON() : undefined,
      dateUpdate: emoluments.dateUpdate?.isValid() ? emoluments.dateUpdate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateEffet = res.body.dateEffet ? dayjs(res.body.dateEffet) : undefined;
      res.body.dateEcheance = res.body.dateEcheance ? dayjs(res.body.dateEcheance) : undefined;
      res.body.dateInsert = res.body.dateInsert ? dayjs(res.body.dateInsert) : undefined;
      res.body.dateUpdate = res.body.dateUpdate ? dayjs(res.body.dateUpdate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((saisieEmoluments: ISaisieEmoluments) => {
        saisieEmoluments.dateEffet = saisieEmoluments.dateEffet ? dayjs(saisieEmoluments.dateEffet) : undefined;
        saisieEmoluments.dateEcheance = saisieEmoluments.dateEcheance ? dayjs(saisieEmoluments.dateEcheance) : undefined;
        saisieEmoluments.dateInsert = saisieEmoluments.dateInsert ? dayjs(saisieEmoluments.dateInsert) : undefined;
        saisieEmoluments.dateUpdate = saisieEmoluments.dateUpdate ? dayjs(saisieEmoluments.dateUpdate) : undefined;
      });
    }
    return res;
  }
}
