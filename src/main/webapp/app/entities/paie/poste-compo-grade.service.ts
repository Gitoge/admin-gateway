import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { getPosteCompoGradeIdentifier, IPosteCompoGrade } from './poste-compo-grade.model';

export type EntityResponseType = HttpResponse<IPosteCompoGrade>;
export type EntityArrayResponseType = HttpResponse<IPosteCompoGrade[]>;

@Injectable({ providedIn: 'root' })
export class PosteCompoGradeService {
  protected resourceUrl = this.applicationConfigService.getEndpointForPaie('api/poste-compo-grades');
  protected resourceUrlPoste = this.applicationConfigService.getEndpointForPaie('api/valeur-by-poste');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(posteCompoGrade: IPosteCompoGrade): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(posteCompoGrade);
    return this.http
      .post<IPosteCompoGrade>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(posteCompoGrade: IPosteCompoGrade): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(posteCompoGrade);
    return this.http
      .put<IPosteCompoGrade>(`${this.resourceUrl}/${getPosteCompoGradeIdentifier(posteCompoGrade) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(posteCompoGrade: IPosteCompoGrade): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(posteCompoGrade);
    return this.http
      .patch<IPosteCompoGrade>(`${this.resourceUrl}/${getPosteCompoGradeIdentifier(posteCompoGrade) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPosteCompoGrade>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }
  findValeurByPostes(posteComposant: string, posteCompose: string): Observable<EntityResponseType> {
    return this.http
      .get<IPosteCompoGrade>(`${this.resourceUrlPoste}?posteComposant=${posteComposant}&posteCompose=${posteCompose}`, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPosteCompoGrade[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPosteCompoGradeToCollectionIfMissing(
    posteCompoGradeCollection: IPosteCompoGrade[],
    ...posteCompoGradesToCheck: (IPosteCompoGrade | null | undefined)[]
  ): IPosteCompoGrade[] {
    const posteCompoGrades: IPosteCompoGrade[] = posteCompoGradesToCheck.filter(isPresent);
    if (posteCompoGrades.length > 0) {
      const posteCompoGradeCollectionIdentifiers = posteCompoGradeCollection.map(
        posteCompoGradeItem => getPosteCompoGradeIdentifier(posteCompoGradeItem)!
      );
      const posteCompoGradesToAdd = posteCompoGrades.filter(posteCompoGradeItem => {
        const posteCompoGradeIdentifier = getPosteCompoGradeIdentifier(posteCompoGradeItem);
        if (posteCompoGradeIdentifier == null || posteCompoGradeCollectionIdentifiers.includes(posteCompoGradeIdentifier)) {
          return false;
        }
        posteCompoGradeCollectionIdentifiers.push(posteCompoGradeIdentifier);
        return true;
      });
      return [...posteCompoGradesToAdd, ...posteCompoGradeCollection];
    }
    return posteCompoGradeCollection;
  }

  protected convertDateFromClient(posteCompoGrade: IPosteCompoGrade): IPosteCompoGrade {
    return Object.assign({}, posteCompoGrade, {
      dateInsert: posteCompoGrade.dateInsert?.isValid() ? posteCompoGrade.dateInsert.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateInsert = res.body.dateInsert ? dayjs(res.body.dateInsert) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((posteCompoGrade: IPosteCompoGrade) => {
        posteCompoGrade.dateInsert = posteCompoGrade.dateInsert ? dayjs(posteCompoGrade.dateInsert) : undefined;
      });
    }
    return res;
  }
}
