import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IClasse, getClasseIdentifier } from '../classe.model';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';

export type EntityResponseType = HttpResponse<IClasse>;
export type EntityArrayResponseType = HttpResponse<IClasse[]>;

@Injectable({ providedIn: 'root' })
export class ClasseService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/classes');

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

  create(classe: IClasse): Observable<EntityResponseType> {
    return this.http.post<IClasse>(this.resourceUrl, classe, { observe: 'response' });
  }

  update(classe: IClasse): Observable<EntityResponseType> {
    return this.http.put<IClasse>(`${this.resourceUrl}/${getClasseIdentifier(classe) as number}`, classe, { observe: 'response' });
  }

  partialUpdate(classe: IClasse): Observable<EntityResponseType> {
    return this.http.patch<IClasse>(`${this.resourceUrl}/${getClasseIdentifier(classe) as number}`, classe, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IClasse>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findAll(): Observable<EntityArrayResponseType> {
    return this.http.get<IClasse[]>(`${this.resourceUrl}/all`, { headers: this.header, observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IClasse[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addClasseToCollectionIfMissing(classeCollection: IClasse[], ...classesToCheck: (IClasse | null | undefined)[]): IClasse[] {
    const classes: IClasse[] = classesToCheck.filter(isPresent);
    if (classes.length > 0) {
      const classeCollectionIdentifiers = classeCollection.map(classeItem => getClasseIdentifier(classeItem)!);
      const classesToAdd = classes.filter(classeItem => {
        const classeIdentifier = getClasseIdentifier(classeItem);
        if (classeIdentifier == null || classeCollectionIdentifiers.includes(classeIdentifier)) {
          return false;
        }
        classeCollectionIdentifiers.push(classeIdentifier);
        return true;
      });
      return [...classesToAdd, ...classeCollection];
    }
    return classeCollection;
  }
}
