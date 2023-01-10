import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISituationAdministrative, getSituationAdministrativeIdentifier } from '../situation-administrative.model';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';

export type EntityResponseType = HttpResponse<ISituationAdministrative>;
export type EntityArrayResponseType = HttpResponse<ISituationAdministrative[]>;

@Injectable({ providedIn: 'root' })
export class SituationAdministrativeService {
  protected resourceUrl = this.applicationConfigService.getEndpointForCarriere('api/situation-administratives');
  protected resourceUrlByAgent = this.applicationConfigService.getEndpointForCarriere('api/situation-administratives/agent');

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

  create(situationAdministrative: ISituationAdministrative): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(situationAdministrative);
    return this.http
      .post<ISituationAdministrative>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(situationAdministrative: ISituationAdministrative): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(situationAdministrative);
    return this.http
      .put<ISituationAdministrative>(
        `${this.resourceUrl}/${getSituationAdministrativeIdentifier(situationAdministrative) as number}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(situationAdministrative: ISituationAdministrative): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(situationAdministrative);
    return this.http
      .patch<ISituationAdministrative>(
        `${this.resourceUrl}/${getSituationAdministrativeIdentifier(situationAdministrative) as number}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ISituationAdministrative>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findAll(): Observable<EntityArrayResponseType> {
    return this.http.get<ISituationAdministrative[]>(`${this.resourceUrl}/all`, { headers: this.header, observe: 'response' });
  }

  findByAgent(agentId: number): Observable<EntityResponseType> {
    return this.http.get<ISituationAdministrative>(`${this.resourceUrlByAgent}?agentId=${agentId}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISituationAdministrative[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSituationAdministrativeToCollectionIfMissing(
    situationAdministrativeCollection: ISituationAdministrative[],
    ...situationAdministrativesToCheck: (ISituationAdministrative | null | undefined)[]
  ): ISituationAdministrative[] {
    const situationAdministratives: ISituationAdministrative[] = situationAdministrativesToCheck.filter(isPresent);
    if (situationAdministratives.length > 0) {
      const situationAdministrativeCollectionIdentifiers = situationAdministrativeCollection.map(
        situationAdministrativeItem => getSituationAdministrativeIdentifier(situationAdministrativeItem)!
      );
      const situationAdministrativesToAdd = situationAdministratives.filter(situationAdministrativeItem => {
        const situationAdministrativeIdentifier = getSituationAdministrativeIdentifier(situationAdministrativeItem);
        if (
          situationAdministrativeIdentifier == null ||
          situationAdministrativeCollectionIdentifiers.includes(situationAdministrativeIdentifier)
        ) {
          return false;
        }
        situationAdministrativeCollectionIdentifiers.push(situationAdministrativeIdentifier);
        return true;
      });
      return [...situationAdministrativesToAdd, ...situationAdministrativeCollection];
    }
    return situationAdministrativeCollection;
  }

  protected convertDateFromClient(situationAdministrative: ISituationAdministrative): ISituationAdministrative {
    return Object.assign({}, situationAdministrative, {
      dateRecrutement: situationAdministrative.dateRecrutement?.isValid()
        ? situationAdministrative.dateRecrutement.format(DATE_FORMAT)
        : undefined,
      datePriseRang: situationAdministrative.datePriseRang?.isValid()
        ? situationAdministrative.datePriseRang.format(DATE_FORMAT)
        : undefined,
      dateOrdreService: situationAdministrative.dateOrdreService?.isValid()
        ? situationAdministrative.dateOrdreService.format(DATE_FORMAT)
        : undefined,
      datedebut: situationAdministrative.datedebut?.isValid() ? situationAdministrative.datedebut.format(DATE_FORMAT) : undefined,
      datefin: situationAdministrative.datefin?.isValid() ? situationAdministrative.datefin.format(DATE_FORMAT) : undefined,
      dateInsert: situationAdministrative.dateInsert?.isValid() ? situationAdministrative.dateInsert.toJSON() : undefined,
      dateUpdate: situationAdministrative.dateUpdate?.isValid() ? situationAdministrative.dateUpdate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateRecrutement = res.body.dateRecrutement ? dayjs(res.body.dateRecrutement) : undefined;
      res.body.datePriseRang = res.body.datePriseRang ? dayjs(res.body.datePriseRang) : undefined;
      res.body.dateOrdreService = res.body.dateOrdreService ? dayjs(res.body.dateOrdreService) : undefined;
      res.body.datedebut = res.body.datedebut ? dayjs(res.body.datedebut) : undefined;
      res.body.datefin = res.body.datefin ? dayjs(res.body.datefin) : undefined;
      res.body.dateInsert = res.body.dateInsert ? dayjs(res.body.dateInsert) : undefined;
      res.body.dateUpdate = res.body.dateUpdate ? dayjs(res.body.dateUpdate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((situationAdministrative: ISituationAdministrative) => {
        situationAdministrative.dateRecrutement = situationAdministrative.dateRecrutement
          ? dayjs(situationAdministrative.dateRecrutement)
          : undefined;
        situationAdministrative.datePriseRang = situationAdministrative.datePriseRang
          ? dayjs(situationAdministrative.datePriseRang)
          : undefined;
        situationAdministrative.dateOrdreService = situationAdministrative.dateOrdreService
          ? dayjs(situationAdministrative.dateOrdreService)
          : undefined;
        situationAdministrative.datedebut = situationAdministrative.datedebut ? dayjs(situationAdministrative.datedebut) : undefined;
        situationAdministrative.datefin = situationAdministrative.datefin ? dayjs(situationAdministrative.datefin) : undefined;
        situationAdministrative.dateInsert = situationAdministrative.dateInsert ? dayjs(situationAdministrative.dateInsert) : undefined;
        situationAdministrative.dateUpdate = situationAdministrative.dateUpdate ? dayjs(situationAdministrative.dateUpdate) : undefined;
      });
    }
    return res;
  }
}
