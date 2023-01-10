import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISaisieElementsVariables, getSaisieElementsVariablesIdentifier } from '../saisie-elements-variables.model';
import { IAgent } from '../../../carriere/agent/agent.model';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';

export type EntityResponseType = HttpResponse<ISaisieElementsVariables>;
export type EntityArrayResponseType = HttpResponse<ISaisieElementsVariables[]>;

@Injectable({ providedIn: 'root' })
export class SaisieElementsVariablesService {
  protected resourceUrl = this.applicationConfigService.getEndpointForPaie('api/saisie-elements-variables');
  protected resourceUrlMatricule = this.applicationConfigService.getEndpointForPaie('api/elements/matricule');

  private header: HttpHeaders;

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    private authServerProvider: AuthServerProvider
  ) {
    this.header = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.authServerProvider.getToken())
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');
  }

  create(saisieElementsVariables: ISaisieElementsVariables): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(saisieElementsVariables);
    return this.http
      .post<ISaisieElementsVariables>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(saisieElementsVariables: ISaisieElementsVariables): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(saisieElementsVariables);
    return this.http
      .put<ISaisieElementsVariables>(
        `${this.resourceUrl}/${getSaisieElementsVariablesIdentifier(saisieElementsVariables) as number}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(saisieElementsVariables: ISaisieElementsVariables): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(saisieElementsVariables);
    return this.http
      .patch<ISaisieElementsVariables>(
        `${this.resourceUrl}/${getSaisieElementsVariablesIdentifier(saisieElementsVariables) as number}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ISaisieElementsVariables>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findAll(): Observable<EntityArrayResponseType> {
    return this.http.get<ISaisieElementsVariables[]>(`${this.resourceUrl}/all`, { headers: this.header, observe: 'response' });
  }

  query(matricule: string, periodeId: number, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISaisieElementsVariables[]>(`${this.resourceUrl}?matricule=${matricule}&periodeId=${periodeId}`, {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findElementByMatricule(matricule: string): Observable<EntityResponseType> {
    return this.http.get<IAgent>(`${this.resourceUrlMatricule}?matricule=${matricule}`, { observe: 'response' });
    //   .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }
  addSaisieElementsVariablesToCollectionIfMissing(
    saisieElementsVariablesCollection: ISaisieElementsVariables[],
    ...saisieElementsVariablesToCheck: (ISaisieElementsVariables | null | undefined)[]
  ): ISaisieElementsVariables[] {
    const saisieElementsVariables: ISaisieElementsVariables[] = saisieElementsVariablesToCheck.filter(isPresent);
    if (saisieElementsVariables.length > 0) {
      const saisieElementsVariablesCollectionIdentifiers = saisieElementsVariablesCollection.map(
        saisieElementsVariablesItem => getSaisieElementsVariablesIdentifier(saisieElementsVariablesItem)!
      );
      const saisieElementsVariablesToAdd = saisieElementsVariables.filter(saisieElementsVariablesItem => {
        const saisieElementsVariablesIdentifier = getSaisieElementsVariablesIdentifier(saisieElementsVariablesItem);
        if (
          saisieElementsVariablesIdentifier == null ||
          saisieElementsVariablesCollectionIdentifiers.includes(saisieElementsVariablesIdentifier)
        ) {
          return false;
        }
        saisieElementsVariablesCollectionIdentifiers.push(saisieElementsVariablesIdentifier);
        return true;
      });
      return [...saisieElementsVariablesToAdd, ...saisieElementsVariablesCollection];
    }
    return saisieElementsVariablesCollection;
  }

  protected convertDateFromClient(saisieElementsVariables: ISaisieElementsVariables): ISaisieElementsVariables {
    return Object.assign({}, saisieElementsVariables, {
      dateDebut: saisieElementsVariables.dateEffet ? saisieElementsVariables.dateEffet : undefined,
      dateEcheance: saisieElementsVariables.dateEcheance ? saisieElementsVariables.dateEcheance : undefined,
      dateInsert: saisieElementsVariables.dateInsert ? saisieElementsVariables.dateInsert.toJSON() : undefined,
      dateUpdate: saisieElementsVariables.dateUpdate ? saisieElementsVariables.dateUpdate.toJSON() : undefined,
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
      res.body.forEach((saisieElementsVariables: ISaisieElementsVariables) => {
        saisieElementsVariables.dateEffet = saisieElementsVariables.dateEffet ? dayjs(saisieElementsVariables.dateEffet) : undefined;
        saisieElementsVariables.dateEcheance = saisieElementsVariables.dateEcheance
          ? dayjs(saisieElementsVariables.dateEcheance)
          : undefined;
        saisieElementsVariables.dateInsert = saisieElementsVariables.dateInsert ? dayjs(saisieElementsVariables.dateInsert) : undefined;
        saisieElementsVariables.dateUpdate = saisieElementsVariables.dateUpdate ? dayjs(saisieElementsVariables.dateUpdate) : undefined;
      });
    }
    return res;
  }
}
