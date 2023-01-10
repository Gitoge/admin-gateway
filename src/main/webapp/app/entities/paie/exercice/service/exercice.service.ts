import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExercice, getExerciceIdentifier } from '../exercice.model';

export type EntityResponseType = HttpResponse<IExercice>;
export type EntityArrayResponseType = HttpResponse<IExercice[]>;

@Injectable({ providedIn: 'root' })
export class ExerciceService {
  protected resourceUrl = this.applicationConfigService.getEndpointForPaie('api/exercices');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(exercice: IExercice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(exercice);
    return this.http
      .post<IExercice>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(exercice: IExercice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(exercice);
    return this.http
      .put<IExercice>(`${this.resourceUrl}/${getExerciceIdentifier(exercice) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(exercice: IExercice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(exercice);
    return this.http
      .patch<IExercice>(`${this.resourceUrl}/${getExerciceIdentifier(exercice) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IExercice>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IExercice[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addExerciceToCollectionIfMissing(exerciceCollection: IExercice[], ...exercicesToCheck: (IExercice | null | undefined)[]): IExercice[] {
    const exercices: IExercice[] = exercicesToCheck.filter(isPresent);
    if (exercices.length > 0) {
      const exerciceCollectionIdentifiers = exerciceCollection.map(exerciceItem => getExerciceIdentifier(exerciceItem)!);
      const exercicesToAdd = exercices.filter(exerciceItem => {
        const exerciceIdentifier = getExerciceIdentifier(exerciceItem);
        if (exerciceIdentifier == null || exerciceCollectionIdentifiers.includes(exerciceIdentifier)) {
          return false;
        }
        exerciceCollectionIdentifiers.push(exerciceIdentifier);
        return true;
      });
      return [...exercicesToAdd, ...exerciceCollection];
    }
    return exerciceCollection;
  }

  protected convertDateFromClient(exercice: IExercice): IExercice {
    return Object.assign({}, exercice, {
      dateDebut: exercice.dateDebut?.isValid() ? exercice.dateDebut.format(DATE_FORMAT) : undefined,
      dateFin: exercice.dateFin?.isValid() ? exercice.dateFin.format(DATE_FORMAT) : undefined,
      dateOuverture: exercice.dateOuverture?.isValid() ? exercice.dateOuverture.format(DATE_FORMAT) : undefined,
      dateFermeture: exercice.dateFermeture?.isValid() ? exercice.dateFermeture.format(DATE_FORMAT) : undefined,
      dateInsert: exercice.dateInsert?.isValid() ? exercice.dateInsert.toJSON() : undefined,
      dateUpdate: exercice.dateUpdate?.isValid() ? exercice.dateUpdate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateDebut = res.body.dateDebut ? dayjs(res.body.dateDebut) : undefined;
      res.body.dateFin = res.body.dateFin ? dayjs(res.body.dateFin) : undefined;
      res.body.dateOuverture = res.body.dateOuverture ? dayjs(res.body.dateOuverture) : undefined;
      res.body.dateFermeture = res.body.dateFermeture ? dayjs(res.body.dateFermeture) : undefined;
      res.body.dateInsert = res.body.dateInsert ? dayjs(res.body.dateInsert) : undefined;
      res.body.dateUpdate = res.body.dateUpdate ? dayjs(res.body.dateUpdate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((exercice: IExercice) => {
        exercice.dateDebut = exercice.dateDebut ? dayjs(exercice.dateDebut) : undefined;
        exercice.dateFin = exercice.dateFin ? dayjs(exercice.dateFin) : undefined;
        exercice.dateOuverture = exercice.dateOuverture ? dayjs(exercice.dateOuverture) : undefined;
        exercice.dateFermeture = exercice.dateFermeture ? dayjs(exercice.dateFermeture) : undefined;
        exercice.dateInsert = exercice.dateInsert ? dayjs(exercice.dateInsert) : undefined;
        exercice.dateUpdate = exercice.dateUpdate ? dayjs(exercice.dateUpdate) : undefined;
      });
    }
    return res;
  }
}
