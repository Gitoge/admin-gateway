import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPersonne, getPersonneIdentifier } from '../personne.model';
import { AuthServerProvider } from '../../../core/auth/auth-jwt.service';
import { SERVER_API_URL_BACKEND } from 'app/app.constants';
import { IInfosUser } from 'app/shared/model/infosUser';

export type EntityResponseType = HttpResponse<IPersonne>;
export type EntityArrayResponseType = HttpResponse<IPersonne[]>;

export type EntityResponseType2 = HttpResponse<IInfosUser>;

@Injectable({ providedIn: 'root' })
export class PersonneService {
  public resourceUrl = SERVER_API_URL_BACKEND + 'api/personnes';
  public resourceUrlDelete = SERVER_API_URL_BACKEND + 'api/personnes-delete';

  public resourceUrlPersonneConnected = SERVER_API_URL_BACKEND + 'api/personnes/recherches';
  public resourceUrlAdminConnected = SERVER_API_URL_BACKEND + 'api/personnes/recherches-admin';
  public resourceUrlSuperAdmin = SERVER_API_URL_BACKEND + 'api/personnes/superAdmin';
  public resourceUrlChangePremiereConnexion = SERVER_API_URL_BACKEND + 'api/personnes/mise-a-jour/premiere-connexion';
  public resourceUrlChangeDerniereConnexion = SERVER_API_URL_BACKEND + 'api/personnes/mise-a-jour/derniere-connexion';

  // protected resourceUrl = this.applicationConfigService.getEndpointFor('api/personnes');

  private header: HttpHeaders;

  constructor(
    protected http: HttpClient,
    private applicationConfigService: ApplicationConfigService,
    private authServerProvider: AuthServerProvider
  ) {
    this.header = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.authServerProvider.getToken())
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');
  }

  create(personne: IPersonne): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(personne);
    return this.http
      .post<IPersonne>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(personne: IPersonne): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(personne);
    return this.http
      .put<IPersonne>(`${this.resourceUrl}/${getPersonneIdentifier(personne) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }
  updatePremiereConnexion(id: number): Observable<EntityResponseType> {
    return this.http
      .put<IPersonne>(`${this.resourceUrlChangePremiereConnexion}`, id, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }
  updateDerniereConnexion(id: number): Observable<EntityResponseType> {
    return this.http
      .put<IPersonne>(`${this.resourceUrlChangeDerniereConnexion}`, id, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }
  updatePersonne(personne: IPersonne): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(personne);
    return this.http
      .put<IPersonne>(`${this.resourceUrlDelete}/${getPersonneIdentifier(personne) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(personne: IPersonne): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(personne);
    return this.http
      .patch<IPersonne>(`${this.resourceUrl}/${getPersonneIdentifier(personne) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPersonne>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }
  findUserByUserConect(motCles: string, id: number, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPersonne[]>(`${this.resourceUrlPersonneConnected}?motCles=${motCles}&id=${id}`, {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  findUserByAdminConect(motCles: string, etablissementId: number, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPersonne[]>(`${this.resourceUrlAdminConnected}?motCles=${motCles}&etablissementId=${etablissementId}`, {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }
  findUserBySuperAdminConect(motCles: string, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPersonne[]>(`${this.resourceUrlSuperAdmin}?motCles=${motCles}`, {
        params: options,
        observe: 'response',
      })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  findByJhiUser(user_id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPersonne>(`${this.resourceUrl}/user/infos/${user_id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  getInfosUser(user_id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPersonne>(`${this.resourceUrl}/user/infos/${user_id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => res));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPersonne[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPersonneToCollectionIfMissing(personneCollection: IPersonne[], ...personnesToCheck: (IPersonne | null | undefined)[]): IPersonne[] {
    const personnes: IPersonne[] = personnesToCheck.filter(isPresent);
    if (personnes.length > 0) {
      const personneCollectionIdentifiers = personneCollection.map(personneItem => getPersonneIdentifier(personneItem)!);
      const personnesToAdd = personnes.filter(personneItem => {
        const personneIdentifier = getPersonneIdentifier(personneItem);
        if (personneIdentifier == null || personneCollectionIdentifiers.includes(personneIdentifier)) {
          return false;
        }
        personneCollectionIdentifiers.push(personneIdentifier);
        return true;
      });
      return [...personnesToAdd, ...personneCollection];
    }
    return personneCollection;
  }

  protected convertDateFromClient(personne: IPersonne): IPersonne {
    return Object.assign({}, personne, {
      dateNaissance: personne.dateNaissance?.isValid() ? personne.dateNaissance.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateNaissance = res.body.dateNaissance ? dayjs(res.body.dateNaissance) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((personne: IPersonne) => {
        personne.dateNaissance = personne.dateNaissance ? dayjs(personne.dateNaissance) : undefined;
      });
    }
    return res;
  }
}
