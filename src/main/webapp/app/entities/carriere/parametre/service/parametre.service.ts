import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IParametre, getParametreIdentifier } from '../parametre.model';

export type EntityResponseType = HttpResponse<IParametre>;
export type EntityArrayResponseType = HttpResponse<IParametre[]>;

@Injectable({ providedIn: 'root' })
export class ParametreService {
  protected resourceUrl = this.applicationConfigService.getEndpointForCarriere('api/parametres');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(parametre: IParametre): Observable<EntityResponseType> {
    return this.http.post<IParametre>(this.resourceUrl, parametre, { observe: 'response' });
  }

  update(parametre: IParametre): Observable<EntityResponseType> {
    return this.http.put<IParametre>(`${this.resourceUrl}/${getParametreIdentifier(parametre) as number}`, parametre, {
      observe: 'response',
    });
  }

  partialUpdate(parametre: IParametre): Observable<EntityResponseType> {
    return this.http.patch<IParametre>(`${this.resourceUrl}/${getParametreIdentifier(parametre) as number}`, parametre, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IParametre>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAgeMinPEC(): Observable<EntityResponseType> {
    return this.http.get<IParametre>(`${this.resourceUrl}/age-min-pec`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IParametre[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addParametreToCollectionIfMissing(
    parametreCollection: IParametre[],
    ...parametresToCheck: (IParametre | null | undefined)[]
  ): IParametre[] {
    const parametres: IParametre[] = parametresToCheck.filter(isPresent);
    if (parametres.length > 0) {
      const parametreCollectionIdentifiers = parametreCollection.map(parametreItem => getParametreIdentifier(parametreItem)!);
      const parametresToAdd = parametres.filter(parametreItem => {
        const parametreIdentifier = getParametreIdentifier(parametreItem);
        if (parametreIdentifier == null || parametreCollectionIdentifiers.includes(parametreIdentifier)) {
          return false;
        }
        parametreCollectionIdentifiers.push(parametreIdentifier);
        return true;
      });
      return [...parametresToAdd, ...parametreCollection];
    }
    return parametreCollection;
  }
}
