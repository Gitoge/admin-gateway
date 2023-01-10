import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEnfant, getEnfantIdentifier } from '../enfant.model';

export type EntityResponseType = HttpResponse<IEnfant>;
export type EntityArrayResponseType = HttpResponse<IEnfant[]>;

@Injectable({ providedIn: 'root' })
export class EnfantService {
  protected resourceUrl = this.applicationConfigService.getEndpointForCarriere('api/enfants');
  protected resourceUrlByAgent = this.applicationConfigService.getEndpointForCarriere('api/enfants/agent');
  protected resourceUrlMembresByAgent = this.applicationConfigService.getEndpointForCarriere('api/enfants/membres/agent');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(enfant: IEnfant): Observable<EntityResponseType> {
    //  const copy = this.convertDateFromClient(enfant);
    return this.http.post<IEnfant>(this.resourceUrl, enfant, { observe: 'response' });
    //  .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(enfant: IEnfant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(enfant);
    return this.http
      .put<IEnfant>(`${this.resourceUrl}/${getEnfantIdentifier(enfant) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(enfant: IEnfant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(enfant);
    return this.http
      .patch<IEnfant>(`${this.resourceUrl}/${getEnfantIdentifier(enfant) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IEnfant>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findByAgent(agentId: number): Observable<EntityResponseType> {
    return this.http.get<IEnfant>(`${this.resourceUrlByAgent}?agentId=${agentId}`, { observe: 'response' });
    //   .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findMembresByAgent(agentId: number): Observable<EntityResponseType> {
    return this.http.get<IEnfant>(`${this.resourceUrlMembresByAgent}?agentId=${agentId}`, { observe: 'response' });
    //   .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEnfant[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEnfantToCollectionIfMissing(enfantCollection: IEnfant[], ...enfantsToCheck: (IEnfant | null | undefined)[]): IEnfant[] {
    const enfants: IEnfant[] = enfantsToCheck.filter(isPresent);
    if (enfants.length > 0) {
      const enfantCollectionIdentifiers = enfantCollection.map(enfantItem => getEnfantIdentifier(enfantItem)!);
      const enfantsToAdd = enfants.filter(enfantItem => {
        const enfantIdentifier = getEnfantIdentifier(enfantItem);
        if (enfantIdentifier == null || enfantCollectionIdentifiers.includes(enfantIdentifier)) {
          return false;
        }
        enfantCollectionIdentifiers.push(enfantIdentifier);
        return true;
      });
      return [...enfantsToAdd, ...enfantCollection];
    }
    return enfantCollection;
  }

  protected convertDateFromClient(enfant: IEnfant): IEnfant {
    return Object.assign({}, enfant, {
      dateNaissance: enfant.dateNaissance?.isValid() ? enfant.dateNaissance.format(DATE_FORMAT) : undefined,
      dateActeNaissance: enfant.dateActeNaissance?.isValid() ? enfant.dateActeNaissance.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateNaissance = res.body.dateNaissance ? dayjs(res.body.dateNaissance) : undefined;
      res.body.dateActeNaissance = res.body.dateActeNaissance ? dayjs(res.body.dateActeNaissance) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((enfant: IEnfant) => {
        enfant.dateNaissance = enfant.dateNaissance ? dayjs(enfant.dateNaissance) : undefined;
        enfant.dateActeNaissance = enfant.dateActeNaissance ? dayjs(enfant.dateActeNaissance) : undefined;
      });
    }
    return res;
  }
}
