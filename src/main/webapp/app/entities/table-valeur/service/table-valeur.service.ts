import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITableValeur, getTableValeurIdentifier } from '../table-valeur.model';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';

export type EntityResponseType = HttpResponse<ITableValeur>;
export type EntityArrayResponseType = HttpResponse<ITableValeur[]>;

@Injectable({ providedIn: 'root' })
export class TableValeurService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/table-valeurs');

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

  create(tableValeur: ITableValeur): Observable<EntityResponseType> {
    return this.http.post<ITableValeur>(this.resourceUrl, tableValeur, { observe: 'response' });
  }

  update(tableValeur: ITableValeur): Observable<EntityResponseType> {
    return this.http.put<ITableValeur>(`${this.resourceUrl}/${getTableValeurIdentifier(tableValeur) as number}`, tableValeur, {
      observe: 'response',
    });
  }

  partialUpdate(tableValeur: ITableValeur): Observable<EntityResponseType> {
    return this.http.patch<ITableValeur>(`${this.resourceUrl}/${getTableValeurIdentifier(tableValeur) as number}`, tableValeur, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITableValeur>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITableValeur[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTableValeurToCollectionIfMissing(
    tableValeurCollection: ITableValeur[],
    ...tableValeursToCheck: (ITableValeur | null | undefined)[]
  ): ITableValeur[] {
    const tableValeurs: ITableValeur[] = tableValeursToCheck.filter(isPresent);
    if (tableValeurs.length > 0) {
      const tableValeurCollectionIdentifiers = tableValeurCollection.map(tableValeurItem => getTableValeurIdentifier(tableValeurItem)!);
      const tableValeursToAdd = tableValeurs.filter(tableValeurItem => {
        const tableValeurIdentifier = getTableValeurIdentifier(tableValeurItem);
        if (tableValeurIdentifier == null || tableValeurCollectionIdentifiers.includes(tableValeurIdentifier)) {
          return false;
        }
        tableValeurCollectionIdentifiers.push(tableValeurIdentifier);
        return true;
      });
      return [...tableValeursToAdd, ...tableValeurCollection];
    }
    return tableValeurCollection;
  }

  findPays(): Observable<EntityArrayResponseType> {
    return this.http.get<ITableValeur[]>(`${this.resourceUrl}/pays`, { headers: this.header, observe: 'response' });
  }

  findRemuneration(): Observable<EntityArrayResponseType> {
    return this.http.get<ITableValeur[]>(`${this.resourceUrl}/remuneration`, { headers: this.header, observe: 'response' });
  }

  findTypePiece(): Observable<EntityArrayResponseType> {
    return this.http.get<ITableValeur[]>(`${this.resourceUrl}/type-piece`, { headers: this.header, observe: 'response' });
  }

  findStatutMarital(): Observable<EntityArrayResponseType> {
    return this.http.get<ITableValeur[]>(`${this.resourceUrl}/statut-marital`, { headers: this.header, observe: 'response' });
  }

  findGenre(): Observable<EntityArrayResponseType> {
    return this.http.get<ITableValeur[]>(`${this.resourceUrl}/genre`, { headers: this.header, observe: 'response' });
  }

  findLienParente(): Observable<EntityArrayResponseType> {
    return this.http.get<ITableValeur[]>(`${this.resourceUrl}/lien-parente`, { headers: this.header, observe: 'response' });
  }

  findRouterLinks(): Observable<EntityArrayResponseType> {
    return this.http.get<ITableValeur[]>(`${this.resourceUrl}/router-link`, { headers: this.header, observe: 'response' });
  }

  findIcons(): Observable<EntityArrayResponseType> {
    return this.http.get<ITableValeur[]>(`${this.resourceUrl}/icons`, { headers: this.header, observe: 'response' });
  }

  findNatureActes(): Observable<EntityArrayResponseType> {
    return this.http.get<ITableValeur[]>(`${this.resourceUrl}/nature-actes`, { headers: this.header, observe: 'response' });
  }

  findModeReglement(): Observable<EntityArrayResponseType> {
    return this.http.get<ITableValeur[]>(`${this.resourceUrl}/mode-reglement`, { headers: this.header, observe: 'response' });
  }
}
