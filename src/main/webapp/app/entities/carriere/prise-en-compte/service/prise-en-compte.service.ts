import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPriseEnCompte, getPriseEnCompteIdentifier } from '../prise-en-compte.model';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { IGrilleIndiciaire } from '../../grille-indiciaire/grille-indiciaire.model';
import { ITableValeur } from 'app/entities/table-valeur/table-valeur.model';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

export type EntityResponseType = HttpResponse<IPriseEnCompte>;
export type EntityResponseTypeGrille = HttpResponse<IGrilleIndiciaire>;
export type EntityArrayResponseType = HttpResponse<IPriseEnCompte[]>;

export type EntityResponseTableValeur = HttpResponse<ITableValeur>;

@Injectable({ providedIn: 'root' })
export class PriseEnCompteService {
  protected resourceUrl = this.applicationConfigService.getEndpointForCarriere('api/agents/');

  protected resourceUrl1 = this.applicationConfigService.getEndpointForCarriere('api/prise-en-compte');

  protected resourceUrlByMatricule = this.applicationConfigService.getEndpointForCarriere('api/prise-en-compte/matricule');

  protected resourceUrlAnciens = this.applicationConfigService.getEndpointForCarriere('api/agents/anciens');

  protected resourceUrlGrilleIndiciaire = this.applicationConfigService.getEndpointForCarriere('api/grille-indiciaires');

  protected resourceUrlHierarchie = this.applicationConfigService.getEndpointForCarriere('grille-indiciaires/hierarchie/echelon');

  protected resourceUrlValeur = this.applicationConfigService.getEndpointForBackend('/table-valeurs/code');

  protected resourceUrlAffichePdf = this.applicationConfigService.getEndpointForCarriere('api/prise-en-compte/rapport-prise-en-compte');

  protected resourceUrlCniUnique = this.applicationConfigService.getEndpointForCarriere('api/prise-en-compte/cni-unique');

  private header: HttpHeaders;
  private headerPdf: HttpHeaders;
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    private authServerProvider: AuthServerProvider
  ) {
    this.header = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.authServerProvider.getToken())
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');

    this.headerPdf = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.authServerProvider.getToken())
      .set('Accept', 'application/pdf')
      .set('Content-Type', 'application/pdf');
  }

  create(priseEncompte: IPriseEnCompte): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(priseEncompte);
    return this.http
      .post<IPriseEnCompte>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  createSituations(priseEncompte: IPriseEnCompte): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(priseEncompte);
    return this.http
      .post<IPriseEnCompte>(this.resourceUrlAnciens, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(priseEncompte: IPriseEnCompte): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(priseEncompte);
    return this.http
      .put<IPriseEnCompte>(`${this.resourceUrl1}/${getPriseEnCompteIdentifier(priseEncompte) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(priseEncompte: IPriseEnCompte): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(priseEncompte);
    return this.http
      .patch<IPriseEnCompte>(`${this.resourceUrl1}/${getPriseEnCompteIdentifier(priseEncompte) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPriseEnCompte>(`${this.resourceUrl1}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  priseEnCompteByMatricule(matricule: string): Observable<EntityResponseType> {
    return this.http
      .get<IPriseEnCompte>(`${this.resourceUrlByMatricule}/${matricule}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  numeroPieceUnique(typePiece: string, numeroPiece: string): Observable<EntityResponseType> {
    return this.http.get<IGrilleIndiciaire>(`${this.resourceUrlCniUnique}?typePiece=${typePiece}&numeroPiece=${numeroPiece}`, {
      observe: 'response',
    });
  }

  findByHierarchieAndEchelon(hierarchieId: number, echelonId: number): Observable<EntityResponseTypeGrille> {
    return this.http
      .get<IGrilleIndiciaire>(`${this.resourceUrlGrilleIndiciaire}/?hierarchieId=${hierarchieId}/&echelonId=${echelonId}`, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseTypeGrille) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPriseEnCompte[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  queryListePriseEnCompte(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPriseEnCompte[]>(this.resourceUrl1, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl1}/${id}`, { observe: 'response' });
  }

  findHierarchieAndEchelon(hierarchieId: number, echelonId: number): Observable<EntityResponseTypeGrille> {
    return this.http.get<IGrilleIndiciaire>(`${this.resourceUrlHierarchie}?hierarchieId=${hierarchieId}&echelonId=${echelonId}`, {
      observe: 'response',
    });
  }

  affichePdf(id: number): Observable<Blob> {
    const p = new HttpParams().set('id ', id);
    return this.http.get(this.resourceUrlAffichePdf, {
      params: p,
      headers: this.headerPdf,
      responseType: 'blob',
    });
    /* return this.http.get(`${this.resourceUrlAffichePdf}`, { headers: this.header, params: p, responseType: 'arraybuffer' }).then(function (response) {
        return response;
    }); */

    //return this.http.get<String>(`${this.resourceUrlAffichePdf}`, { headers: this.header, params: p, observe: 'response' });
  }

  addPriseEnCompteToCollectionIfMissing(
    priseEncompteCollection: IPriseEnCompte[],
    ...priseEncomptesToCheck: (IPriseEnCompte | null | undefined)[]
  ): IPriseEnCompte[] {
    const priseEncomptes: IPriseEnCompte[] = priseEncomptesToCheck.filter(isPresent);
    if (priseEncomptes.length > 0) {
      const priseEncompteCollectionIdentifiers = priseEncompteCollection.map(
        priseEncompteItem => getPriseEnCompteIdentifier(priseEncompteItem)!
      );
      const priseEncomptesToAdd = priseEncomptes.filter(priseEncompteItem => {
        const priseEncompteIdentifier = getPriseEnCompteIdentifier(priseEncompteItem);
        if (priseEncompteIdentifier == null || priseEncompteCollectionIdentifiers.includes(priseEncompteIdentifier)) {
          return false;
        }
        priseEncompteCollectionIdentifiers.push(priseEncompteIdentifier);
        return true;
      });
      return [...priseEncomptesToAdd, ...priseEncompteCollection];
    }
    return priseEncompteCollection;
  }

  protected convertDateFromClient(priseEncompte: IPriseEnCompte): IPriseEnCompte {
    return Object.assign({}, priseEncompte, {
      dateInsert: priseEncompte.dateInsert?.isValid() ? priseEncompte.dateInsert.toJSON() : undefined,
      dateUpdate: priseEncompte.dateUpdate?.isValid() ? priseEncompte.dateUpdate.toJSON() : undefined,
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
      res.body.forEach((priseEncompte: IPriseEnCompte) => {
        priseEncompte.dateInsert = priseEncompte.dateInsert ? dayjs(priseEncompte.dateInsert) : undefined;
        priseEncompte.dateUpdate = priseEncompte.dateUpdate ? dayjs(priseEncompte.dateUpdate) : undefined;
      });
    }
    return res;
  }
}
