import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBaremeCalculHeuresSupp, getBaremeCalculHeuresSuppIdentifier } from '../bareme-calcul-heures-supp.model';

export type EntityResponseType = HttpResponse<IBaremeCalculHeuresSupp>;
export type EntityArrayResponseType = HttpResponse<IBaremeCalculHeuresSupp[]>;

@Injectable({ providedIn: 'root' })
export class BaremeCalculHeuresSuppService {
  protected resourceUrl = this.applicationConfigService.getEndpointForPaie('api/bareme-calcul-heures-supps');
  protected resourceUrlHeurSuppIndice = this.applicationConfigService.getEndpointForPaie('api/bareme-calcul-heures-supps/agent-indice');
  protected resourceUrlHeurSuppSoldeGlobale = this.applicationConfigService.getEndpointForPaie(
    'api/bareme-calcul-heures-supps/agent-solde-globale'
  );

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(baremeCalculHeuresSupp: IBaremeCalculHeuresSupp): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(baremeCalculHeuresSupp);
    return this.http
      .post<IBaremeCalculHeuresSupp>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(baremeCalculHeuresSupp: IBaremeCalculHeuresSupp): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(baremeCalculHeuresSupp);
    return this.http
      .put<IBaremeCalculHeuresSupp>(`${this.resourceUrl}/${getBaremeCalculHeuresSuppIdentifier(baremeCalculHeuresSupp) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(baremeCalculHeuresSupp: IBaremeCalculHeuresSupp): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(baremeCalculHeuresSupp);
    return this.http
      .patch<IBaremeCalculHeuresSupp>(
        `${this.resourceUrl}/${getBaremeCalculHeuresSuppIdentifier(baremeCalculHeuresSupp) as number}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IBaremeCalculHeuresSupp>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findBaremeHeureSuppIndice(indice: number): Observable<EntityResponseType> {
    return this.http.get<IBaremeCalculHeuresSupp>(`${this.resourceUrlHeurSuppIndice}/${indice}`, { observe: 'response' });
  }

  findBaremeHeureSuppSoldeGlobale(soldeGlobale: number): Observable<EntityResponseType> {
    return this.http.get<IBaremeCalculHeuresSupp>(`${this.resourceUrlHeurSuppSoldeGlobale}/${soldeGlobale}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBaremeCalculHeuresSupp[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBaremeCalculHeuresSuppToCollectionIfMissing(
    baremeCalculHeuresSuppCollection: IBaremeCalculHeuresSupp[],
    ...baremeCalculHeuresSuppsToCheck: (IBaremeCalculHeuresSupp | null | undefined)[]
  ): IBaremeCalculHeuresSupp[] {
    const baremeCalculHeuresSupps: IBaremeCalculHeuresSupp[] = baremeCalculHeuresSuppsToCheck.filter(isPresent);
    if (baremeCalculHeuresSupps.length > 0) {
      const baremeCalculHeuresSuppCollectionIdentifiers = baremeCalculHeuresSuppCollection.map(
        baremeCalculHeuresSuppItem => getBaremeCalculHeuresSuppIdentifier(baremeCalculHeuresSuppItem)!
      );
      const baremeCalculHeuresSuppsToAdd = baremeCalculHeuresSupps.filter(baremeCalculHeuresSuppItem => {
        const baremeCalculHeuresSuppIdentifier = getBaremeCalculHeuresSuppIdentifier(baremeCalculHeuresSuppItem);
        if (
          baremeCalculHeuresSuppIdentifier == null ||
          baremeCalculHeuresSuppCollectionIdentifiers.includes(baremeCalculHeuresSuppIdentifier)
        ) {
          return false;
        }
        baremeCalculHeuresSuppCollectionIdentifiers.push(baremeCalculHeuresSuppIdentifier);
        return true;
      });
      return [...baremeCalculHeuresSuppsToAdd, ...baremeCalculHeuresSuppCollection];
    }
    return baremeCalculHeuresSuppCollection;
  }

  protected convertDateFromClient(baremeCalculHeuresSupp: IBaremeCalculHeuresSupp): IBaremeCalculHeuresSupp {
    return Object.assign({}, baremeCalculHeuresSupp, {
      dateInsert: baremeCalculHeuresSupp.dateInsert?.isValid() ? baremeCalculHeuresSupp.dateInsert.toJSON() : undefined,
      dateUpdate: baremeCalculHeuresSupp.dateUpdate?.isValid() ? baremeCalculHeuresSupp.dateUpdate.toJSON() : undefined,
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
      res.body.forEach((baremeCalculHeuresSupp: IBaremeCalculHeuresSupp) => {
        baremeCalculHeuresSupp.dateInsert = baremeCalculHeuresSupp.dateInsert ? dayjs(baremeCalculHeuresSupp.dateInsert) : undefined;
        baremeCalculHeuresSupp.dateUpdate = baremeCalculHeuresSupp.dateUpdate ? dayjs(baremeCalculHeuresSupp.dateUpdate) : undefined;
      });
    }
    return res;
  }
}
