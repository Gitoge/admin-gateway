import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITableTypeValeur, getTableTypeValeurIdentifier } from '../table-type-valeur.model';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';

export type EntityResponseType = HttpResponse<ITableTypeValeur>;
export type EntityArrayResponseType = HttpResponse<ITableTypeValeur[]>;

@Injectable({ providedIn: 'root' })
export class TableTypeValeurService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/table-type-valeurs');

  protected resourceListTableTypeValeurUrl = this.applicationConfigService.getEndpointForBackend('api/table-type-valeurs/list');

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

  create(tableTypeValeur: ITableTypeValeur): Observable<EntityResponseType> {
    return this.http.post<ITableTypeValeur>(this.resourceUrl, tableTypeValeur, { observe: 'response' });
  }

  update(tableTypeValeur: ITableTypeValeur): Observable<EntityResponseType> {
    return this.http.put<ITableTypeValeur>(
      `${this.resourceUrl}/${getTableTypeValeurIdentifier(tableTypeValeur) as number}`,
      tableTypeValeur,
      { observe: 'response' }
    );
  }

  partialUpdate(tableTypeValeur: ITableTypeValeur): Observable<EntityResponseType> {
    return this.http.patch<ITableTypeValeur>(
      `${this.resourceUrl}/${getTableTypeValeurIdentifier(tableTypeValeur) as number}`,
      tableTypeValeur,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITableTypeValeur>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITableTypeValeur[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getListTableTypeValeur(): Observable<EntityArrayResponseType> {
    return this.http.get<ITableTypeValeur[]>(this.resourceListTableTypeValeurUrl, { headers: this.header, observe: 'response' });
  }

  addTableTypeValeurToCollectionIfMissing(
    tableTypeValeurCollection: ITableTypeValeur[],
    ...tableTypeValeursToCheck: (ITableTypeValeur | null | undefined)[]
  ): ITableTypeValeur[] {
    const tableTypeValeurs: ITableTypeValeur[] = tableTypeValeursToCheck.filter(isPresent);
    if (tableTypeValeurs.length > 0) {
      const tableTypeValeurCollectionIdentifiers = tableTypeValeurCollection.map(
        tableTypeValeurItem => getTableTypeValeurIdentifier(tableTypeValeurItem)!
      );
      const tableTypeValeursToAdd = tableTypeValeurs.filter(tableTypeValeurItem => {
        const tableTypeValeurIdentifier = getTableTypeValeurIdentifier(tableTypeValeurItem);
        if (tableTypeValeurIdentifier == null || tableTypeValeurCollectionIdentifiers.includes(tableTypeValeurIdentifier)) {
          return false;
        }
        tableTypeValeurCollectionIdentifiers.push(tableTypeValeurIdentifier);
        return true;
      });
      return [...tableTypeValeursToAdd, ...tableTypeValeurCollection];
    }
    return tableTypeValeurCollection;
  }
}
