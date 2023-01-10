import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDirection, getDirectionIdentifier } from '../direction.model';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { SERVER_API_URL_BACKEND } from 'app/app.constants';

export type EntityResponseType = HttpResponse<IDirection>;
export type EntityArrayResponseType = HttpResponse<IDirection[]>;

@Injectable({ providedIn: 'root' })
export class DirectionService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/directions');
  protected resourceUrlDirectionRecherche = SERVER_API_URL_BACKEND + 'api/directions/recherchemotsclés';

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

  create(direction: IDirection): Observable<EntityResponseType> {
    return this.http.post<IDirection>(this.resourceUrl, direction, { observe: 'response' });
  }

  update(direction: IDirection): Observable<EntityResponseType> {
    return this.http.put<IDirection>(`${this.resourceUrl}/${getDirectionIdentifier(direction) as number}`, direction, {
      observe: 'response',
    });
  }

  partialUpdate(direction: IDirection): Observable<EntityResponseType> {
    return this.http.patch<IDirection>(`${this.resourceUrl}/${getDirectionIdentifier(direction) as number}`, direction, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDirection>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findAll(): Observable<EntityArrayResponseType> {
    return this.http.get<IDirection[]>(`${this.resourceUrl}/all`, { headers: this.header, observe: 'response' });
  }

  findDirectionsByMotsCles(motCles: string, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDirection[]>(`${this.resourceUrlDirectionRecherche}?motCles=${motCles}`, {
      params: options,
      observe: 'response',
    });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDirection[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  recherche(motCle: string, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDirection[]>(`${this.resourceUrl}/recherches?motCle=${motCle}`, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDirectionToCollectionIfMissing(
    directionCollection: IDirection[],
    ...directionsToCheck: (IDirection | null | undefined)[]
  ): IDirection[] {
    const directions: IDirection[] = directionsToCheck.filter(isPresent);
    if (directions.length > 0) {
      const directionCollectionIdentifiers = directionCollection.map(directionItem => getDirectionIdentifier(directionItem)!);
      const directionsToAdd = directions.filter(directionItem => {
        const directionIdentifier = getDirectionIdentifier(directionItem);
        if (directionIdentifier == null || directionCollectionIdentifiers.includes(directionIdentifier)) {
          return false;
        }
        directionCollectionIdentifiers.push(directionIdentifier);
        return true;
      });
      return [...directionsToAdd, ...directionCollection];
    }
    return directionCollection;
  }
}
