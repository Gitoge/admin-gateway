import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILocalite, getLocaliteIdentifier } from '../localite.model';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { SERVER_API_URL_BACKEND } from 'app/app.constants';

export type EntityResponseType = HttpResponse<ILocalite>;
export type EntityArrayResponseType = HttpResponse<ILocalite[]>;

@Injectable({ providedIn: 'root' })
export class LocaliteService {
  // protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/localites');
  public resourceUrl = SERVER_API_URL_BACKEND + 'api/localites';
  public resourceUrlLocalitesRecherche = SERVER_API_URL_BACKEND + 'api/localites/recherche';
  private header: HttpHeaders;

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    protected authServerProvider: AuthServerProvider
  ) {
    this.header = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.authServerProvider.getToken())
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');
  }

  create(localite: ILocalite): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(localite);
    return this.http
      .post<ILocalite>(this.resourceUrl, copy, { headers: this.header, observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(localite: ILocalite): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(localite);
    return this.http
      .put<ILocalite>(`${this.resourceUrl}/${getLocaliteIdentifier(localite) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(localite: ILocalite): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(localite);
    return this.http
      .patch<ILocalite>(`${this.resourceUrl}/${getLocaliteIdentifier(localite) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ILocalite>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ILocalite[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLocaliteToCollectionIfMissing(localiteCollection: ILocalite[], ...localitesToCheck: (ILocalite | null | undefined)[]): ILocalite[] {
    const localites: ILocalite[] = localitesToCheck.filter(isPresent);
    if (localites.length > 0) {
      const localiteCollectionIdentifiers = localiteCollection.map(localiteItem => getLocaliteIdentifier(localiteItem)!);
      const localitesToAdd = localites.filter(localiteItem => {
        const localiteIdentifier = getLocaliteIdentifier(localiteItem);
        if (localiteIdentifier == null || localiteCollectionIdentifiers.includes(localiteIdentifier)) {
          return false;
        }
        localiteCollectionIdentifiers.push(localiteIdentifier);
        return true;
      });
      return [...localitesToAdd, ...localiteCollection];
    }
    return localiteCollection;
  }

  findLocaliesByMotsCles(motCles: string, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILocalite[]>(`${this.resourceUrlLocalitesRecherche}?motCles=${motCles}`, {
      params: options,
      observe: 'response',
    });
  }

  findLocalitesByType(code: string): Observable<EntityArrayResponseType> {
    return this.http.get<ILocalite[]>(`${this.resourceUrl + '/type'}?codeTypeLocalite=${code}`, {
      headers: this.header,
      observe: 'response',
    });
  }

  findLocalitesByRattachement(rattachementId: number): Observable<EntityArrayResponseType> {
    return this.http.get<ILocalite[]>(`${this.resourceUrl + '/rattachement'}/${rattachementId}`, {
      headers: this.header,
      observe: 'response',
    });
  }

  protected convertDateFromClient(localite: ILocalite): ILocalite {
    return Object.assign({}, localite, {
      insertDate: localite.insertDate?.isValid() ? localite.insertDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.insertDate = res.body.insertDate ? dayjs(res.body.insertDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((localite: ILocalite) => {
        localite.insertDate = localite.insertDate ? dayjs(localite.insertDate) : undefined;
      });
    }
    return res;
  }
}
