import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFichePaie, getFichePaieIdentifier } from '../fiche-paie.model';

export type EntityResponseType = HttpResponse<IFichePaie>;
export type EntityArrayResponseType = HttpResponse<IFichePaie[]>;

@Injectable({ providedIn: 'root' })
export class FichePaieService {
  protected resourceUrl = this.applicationConfigService.getEndpointForPaie('api/fiche-paies');
  protected resourceUrlFiche = this.applicationConfigService.getEndpointForPaie('api/fiche-paies-byAgent');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(fichePaie: IFichePaie): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(fichePaie);
    return this.http
      .post<IFichePaie>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(fichePaie: IFichePaie): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(fichePaie);
    return this.http
      .put<IFichePaie>(`${this.resourceUrl}/${getFichePaieIdentifier(fichePaie) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(fichePaie: IFichePaie): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(fichePaie);
    return this.http
      .patch<IFichePaie>(`${this.resourceUrl}/${getFichePaieIdentifier(fichePaie) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IFichePaie>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }
  findFicheByAgent(agentId: number, exerciceId: number, periodeId: number): Observable<EntityResponseType> {
    return this.http
      .get<IFichePaie>(`${this.resourceUrlFiche}?agentId=${agentId}&periodeId=${periodeId}&exerciceId=${exerciceId}`, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  sommePoste(periodeId: number): Observable<EntityResponseType> {
    return this.http
      .get<IFichePaie>(`${this.resourceUrl}/somme?periodeId=${periodeId}`, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }
  counEtablissementPoste(periodeId: number): Observable<EntityResponseType> {
    return this.http
      .get<IFichePaie>(`${this.resourceUrl}/countEtablissement?periodeId=${periodeId}`, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IFichePaie[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFichePaieToCollectionIfMissing(
    fichePaieCollection: IFichePaie[],
    ...fichePaiesToCheck: (IFichePaie | null | undefined)[]
  ): IFichePaie[] {
    const fichePaies: IFichePaie[] = fichePaiesToCheck.filter(isPresent);
    if (fichePaies.length > 0) {
      const fichePaieCollectionIdentifiers = fichePaieCollection.map(fichePaieItem => getFichePaieIdentifier(fichePaieItem)!);
      const fichePaiesToAdd = fichePaies.filter(fichePaieItem => {
        const fichePaieIdentifier = getFichePaieIdentifier(fichePaieItem);
        if (fichePaieIdentifier == null || fichePaieCollectionIdentifiers.includes(fichePaieIdentifier)) {
          return false;
        }
        fichePaieCollectionIdentifiers.push(fichePaieIdentifier);
        return true;
      });
      return [...fichePaiesToAdd, ...fichePaieCollection];
    }
    return fichePaieCollection;
  }

  protected convertDateFromClient(fichePaie: IFichePaie): IFichePaie {
    return Object.assign({}, fichePaie, {
      dateCalcul: fichePaie.dateCalcul?.isValid() ? fichePaie.dateCalcul.format(DATE_FORMAT) : undefined,
      dateAnnulationCalcul: fichePaie.dateAnnulationCalcul?.isValid() ? fichePaie.dateAnnulationCalcul.format(DATE_FORMAT) : undefined,
      dateInsert: fichePaie.dateInsert?.isValid() ? fichePaie.dateInsert.toJSON() : undefined,
      dateUpdate: fichePaie.dateUpdate?.isValid() ? fichePaie.dateUpdate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateCalcul = res.body.dateCalcul ? dayjs(res.body.dateCalcul) : undefined;
      res.body.dateAnnulationCalcul = res.body.dateAnnulationCalcul ? dayjs(res.body.dateAnnulationCalcul) : undefined;
      res.body.dateInsert = res.body.dateInsert ? dayjs(res.body.dateInsert) : undefined;
      res.body.dateUpdate = res.body.dateUpdate ? dayjs(res.body.dateUpdate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((fichePaie: IFichePaie) => {
        fichePaie.dateCalcul = fichePaie.dateCalcul ? dayjs(fichePaie.dateCalcul) : undefined;
        fichePaie.dateAnnulationCalcul = fichePaie.dateAnnulationCalcul ? dayjs(fichePaie.dateAnnulationCalcul) : undefined;
        fichePaie.dateInsert = fichePaie.dateInsert ? dayjs(fichePaie.dateInsert) : undefined;
        fichePaie.dateUpdate = fichePaie.dateUpdate ? dayjs(fichePaie.dateUpdate) : undefined;
      });
    }
    return res;
  }
}
