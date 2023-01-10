import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPeriodePaye, getPeriodePayeIdentifier } from '../periode-paye.model';

export type EntityResponseType = HttpResponse<IPeriodePaye>;
export type EntityArrayResponseType = HttpResponse<IPeriodePaye[]>;

@Injectable({ providedIn: 'root' })
export class PeriodePayeService {
  protected resourceUrl = this.applicationConfigService.getEndpointForPaie('api/periode-payes');
  protected resourceUrlByExercice = this.applicationConfigService.getEndpointForPaie('api/periode-payes-byExercice');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(periodePaye: IPeriodePaye): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(periodePaye);
    return this.http
      .post<IPeriodePaye>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(periodePaye: IPeriodePaye): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(periodePaye);
    return this.http
      .put<IPeriodePaye>(`${this.resourceUrl}/${getPeriodePayeIdentifier(periodePaye) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(periodePaye: IPeriodePaye): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(periodePaye);
    return this.http
      .patch<IPeriodePaye>(`${this.resourceUrl}/${getPeriodePayeIdentifier(periodePaye) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPeriodePaye>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findPeriodeEnCours(): Observable<EntityResponseType> {
    return this.http
      .get<IPeriodePaye>(`${this.resourceUrl}/en-cours`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }
  findPeriodeByExercice(exerciceId: number): Observable<EntityResponseType> {
    return this.http
      .get<IPeriodePaye>(`${this.resourceUrlByExercice}?exerciceId=${exerciceId}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPeriodePaye[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  queryByExercice(exerciceId: number, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPeriodePaye[]>(`${this.resourceUrlByExercice}?exerciceId=${exerciceId}`, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPeriodePayeToCollectionIfMissing(
    periodePayeCollection: IPeriodePaye[],
    ...periodePayesToCheck: (IPeriodePaye | null | undefined)[]
  ): IPeriodePaye[] {
    const periodePayes: IPeriodePaye[] = periodePayesToCheck.filter(isPresent);
    if (periodePayes.length > 0) {
      const periodePayeCollectionIdentifiers = periodePayeCollection.map(periodePayeItem => getPeriodePayeIdentifier(periodePayeItem)!);
      const periodePayesToAdd = periodePayes.filter(periodePayeItem => {
        const periodePayeIdentifier = getPeriodePayeIdentifier(periodePayeItem);
        if (periodePayeIdentifier == null || periodePayeCollectionIdentifiers.includes(periodePayeIdentifier)) {
          return false;
        }
        periodePayeCollectionIdentifiers.push(periodePayeIdentifier);
        return true;
      });
      return [...periodePayesToAdd, ...periodePayeCollection];
    }
    return periodePayeCollection;
  }

  protected convertDateFromClient(periodePaye: IPeriodePaye): IPeriodePaye {
    return Object.assign({}, periodePaye, {
      dateDebut: periodePaye.dateDebut ? periodePaye.dateDebut : undefined,
      dateFin: periodePaye.dateFin ? periodePaye.dateFin : undefined,
      dateDebutSaisie: periodePaye.dateDebutSaisie ? periodePaye.dateDebutSaisie : undefined,
      dateFinSaisie: periodePaye.dateFinSaisie ? periodePaye.dateFinSaisie : undefined,
      dateDebutCalculSal: periodePaye.dateDebutCalculSal ? periodePaye.dateDebutCalculSal : undefined,
      dateFinCalculSal: periodePaye.dateFinCalculSal ? periodePaye.dateFinCalculSal : undefined,
      dateInsert: periodePaye.dateInsert ? periodePaye.dateInsert.toJSON() : undefined,
      dateUpdate: periodePaye.dateUpdate ? periodePaye.dateUpdate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateDebut = res.body.dateDebut ? dayjs(res.body.dateDebut) : undefined;
      res.body.dateFin = res.body.dateFin ? dayjs(res.body.dateFin) : undefined;
      res.body.dateDebutSaisie = res.body.dateDebutSaisie ? dayjs(res.body.dateDebutSaisie) : undefined;
      res.body.dateFinSaisie = res.body.dateFinSaisie ? dayjs(res.body.dateFinSaisie) : undefined;
      res.body.dateDebutCalculSal = res.body.dateDebutCalculSal ? dayjs(res.body.dateDebutCalculSal) : undefined;
      res.body.dateFinCalculSal = res.body.dateFinCalculSal ? dayjs(res.body.dateFinCalculSal) : undefined;
      res.body.dateInsert = res.body.dateInsert ? dayjs(res.body.dateInsert) : undefined;
      res.body.dateUpdate = res.body.dateUpdate ? dayjs(res.body.dateUpdate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((periodePaye: IPeriodePaye) => {
        periodePaye.dateDebut = periodePaye.dateDebut ? dayjs(periodePaye.dateDebut) : undefined;
        periodePaye.dateFin = periodePaye.dateFin ? dayjs(periodePaye.dateFin) : undefined;
        periodePaye.dateDebutSaisie = periodePaye.dateDebutSaisie ? dayjs(periodePaye.dateDebutSaisie) : undefined;
        periodePaye.dateFinSaisie = periodePaye.dateFinSaisie ? dayjs(periodePaye.dateFinSaisie) : undefined;
        periodePaye.dateDebutCalculSal = periodePaye.dateDebutCalculSal ? dayjs(periodePaye.dateDebutCalculSal) : undefined;
        periodePaye.dateFinCalculSal = periodePaye.dateFinCalculSal ? dayjs(periodePaye.dateFinCalculSal) : undefined;
        periodePaye.dateInsert = periodePaye.dateInsert ? dayjs(periodePaye.dateInsert) : undefined;
        periodePaye.dateUpdate = periodePaye.dateUpdate ? dayjs(periodePaye.dateUpdate) : undefined;
      });
    }
    return res;
  }
}
