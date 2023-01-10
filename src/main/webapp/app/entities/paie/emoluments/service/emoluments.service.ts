import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEmoluments, getEmolumentsIdentifier } from '../emoluments.model';
import { IEnfant } from '../../../carriere/enfant/enfant.model';

export type EntityResponseType = HttpResponse<IEmoluments>;
export type EntityResponseTypeEmoluent = IEmoluments;
export type EntityArrayResponseType = HttpResponse<IEmoluments[]>;

@Injectable({ providedIn: 'root' })
export class EmolumentsService {
  protected resourceUrl = this.applicationConfigService.getEndpointForPaie('api/emoluments');
  protected resourceUrlByMatricule = this.applicationConfigService.getEndpointForPaie('api/emoluments/matricule');
  private resourceUrlByEmolument = this.applicationConfigService.getEndpointForPaie('api/emolumentsId');
  private resourceUrlGenererEmolument = this.applicationConfigService.getEndpointForCarriere('api/calcul/augmentations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(emoluments: IEmoluments): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(emoluments);
    return this.http
      .post<IEmoluments>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(emoluments: IEmoluments): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(emoluments);
    return this.http
      .put<IEmoluments>(`${this.resourceUrl}/${getEmolumentsIdentifier(emoluments) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(emoluments: IEmoluments): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(emoluments);
    return this.http
      .patch<IEmoluments>(`${this.resourceUrl}/${getEmolumentsIdentifier(emoluments) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IEmoluments>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findEmolumentsByMatricule(matricule: string): Observable<EntityResponseType> {
    return this.http.get<IEmoluments>(`${this.resourceUrlByMatricule}?matricule=${matricule}`, { observe: 'response' });
    //   .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }
  findByEmolument(emolumentId: number): Observable<EntityResponseType> {
    return this.http.get<IEnfant>(`${this.resourceUrlByEmolument}?emolumentId=${emolumentId}`, { observe: 'response' });
    //   .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  genererEmolumentByGrade(agentId: number): Observable<any> {
    return this.http.get<IEmoluments[]>(`${this.resourceUrlGenererEmolument}/grade?agentId=${agentId}`, { observe: 'response' });
  }

  genererEmolumentByEmplois(agentId: number): Observable<any> {
    return this.http.get<IEmoluments[]>(`${this.resourceUrlGenererEmolument}/emplois?agentId=${agentId}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEmoluments[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEmolumentsToCollectionIfMissing(
    emolumentsCollection: IEmoluments[],
    ...emolumentsToCheck: (IEmoluments | null | undefined)[]
  ): IEmoluments[] {
    const emoluments: IEmoluments[] = emolumentsToCheck.filter(isPresent);
    if (emoluments.length > 0) {
      const emolumentsCollectionIdentifiers = emolumentsCollection.map(emolumentsItem => getEmolumentsIdentifier(emolumentsItem)!);
      const emolumentsToAdd = emoluments.filter(emolumentsItem => {
        const emolumentsIdentifier = getEmolumentsIdentifier(emolumentsItem);
        if (emolumentsIdentifier == null || emolumentsCollectionIdentifiers.includes(emolumentsIdentifier)) {
          return false;
        }
        emolumentsCollectionIdentifiers.push(emolumentsIdentifier);
        return true;
      });
      return [...emolumentsToAdd, ...emolumentsCollection];
    }
    return emolumentsCollection;
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
      res.body.forEach((emoluments: IEmoluments) => {
        emoluments.dateEffet = emoluments.dateEffet ? dayjs(emoluments.dateEffet) : undefined;
        emoluments.dateEcheance = emoluments.dateEcheance ? dayjs(emoluments.dateEcheance) : undefined;
        emoluments.dateInsert = emoluments.dateInsert ? dayjs(emoluments.dateInsert) : undefined;
        emoluments.dateUpdate = emoluments.dateUpdate ? dayjs(emoluments.dateUpdate) : undefined;
      });
    }
    return res;
  }
}
