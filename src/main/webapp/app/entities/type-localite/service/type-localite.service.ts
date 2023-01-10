import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_API_URL_BACKEND } from 'app/app.constants';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITypeLocalite, getTypeLocaliteIdentifier } from '../type-localite.model';

export type EntityResponseType = HttpResponse<ITypeLocalite>;
export type EntityArrayResponseType = HttpResponse<ITypeLocalite[]>;

@Injectable({ providedIn: 'root' })
export class TypeLocaliteService {
  //protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/type-localites');
  public resourceUrl = SERVER_API_URL_BACKEND + 'api/type-localites';
  protected resourceUrlTypeLocaliteRecherche = SERVER_API_URL_BACKEND + 'api/type-localites/recherchemotsclés';

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(typeLocalite: ITypeLocalite): Observable<EntityResponseType> {
    return this.http.post<ITypeLocalite>(this.resourceUrl, typeLocalite, { observe: 'response' });
  }

  update(typeLocalite: ITypeLocalite): Observable<EntityResponseType> {
    return this.http.put<ITypeLocalite>(`${this.resourceUrl}/${getTypeLocaliteIdentifier(typeLocalite) as number}`, typeLocalite, {
      observe: 'response',
    });
  }

  partialUpdate(typeLocalite: ITypeLocalite): Observable<EntityResponseType> {
    return this.http.patch<ITypeLocalite>(`${this.resourceUrl}/${getTypeLocaliteIdentifier(typeLocalite) as number}`, typeLocalite, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITypeLocalite>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findTypeLocaliteByMotsCles(motCles: string, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITypeLocalite[]>(`${this.resourceUrlTypeLocaliteRecherche}?motCles=${motCles}`, {
      params: options,
      observe: 'response',
    });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITypeLocalite[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTypeLocaliteToCollectionIfMissing(
    typeLocaliteCollection: ITypeLocalite[],
    ...typeLocalitesToCheck: (ITypeLocalite | null | undefined)[]
  ): ITypeLocalite[] {
    const typeLocalites: ITypeLocalite[] = typeLocalitesToCheck.filter(isPresent);
    if (typeLocalites.length > 0) {
      const typeLocaliteCollectionIdentifiers = typeLocaliteCollection.map(
        typeLocaliteItem => getTypeLocaliteIdentifier(typeLocaliteItem)!
      );
      const typeLocalitesToAdd = typeLocalites.filter(typeLocaliteItem => {
        const typeLocaliteIdentifier = getTypeLocaliteIdentifier(typeLocaliteItem);
        if (typeLocaliteIdentifier == null || typeLocaliteCollectionIdentifiers.includes(typeLocaliteIdentifier)) {
          return false;
        }
        typeLocaliteCollectionIdentifiers.push(typeLocaliteIdentifier);
        return true;
      });
      return [...typeLocalitesToAdd, ...typeLocaliteCollection];
    }
    return typeLocaliteCollection;
  }
}
