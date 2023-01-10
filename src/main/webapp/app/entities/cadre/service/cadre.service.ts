import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICadre, getCadreIdentifier } from '../cadre.model';

export type EntityResponseType = HttpResponse<ICadre>;
export type EntityArrayResponseType = HttpResponse<ICadre[]>;

@Injectable({ providedIn: 'root' })
export class CadreService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/cadres');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(cadre: ICadre): Observable<EntityResponseType> {
    return this.http.post<ICadre>(this.resourceUrl, cadre, { observe: 'response' });
  }

  update(cadre: ICadre): Observable<EntityResponseType> {
    return this.http.put<ICadre>(`${this.resourceUrl}/${getCadreIdentifier(cadre) as number}`, cadre, { observe: 'response' });
  }

  partialUpdate(cadre: ICadre): Observable<EntityResponseType> {
    return this.http.patch<ICadre>(`${this.resourceUrl}/${getCadreIdentifier(cadre) as number}`, cadre, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICadre>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICadre[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCadreToCollectionIfMissing(cadreCollection: ICadre[], ...cadresToCheck: (ICadre | null | undefined)[]): ICadre[] {
    const cadres: ICadre[] = cadresToCheck.filter(isPresent);
    if (cadres.length > 0) {
      const cadreCollectionIdentifiers = cadreCollection.map(cadreItem => getCadreIdentifier(cadreItem)!);
      const cadresToAdd = cadres.filter(cadreItem => {
        const cadreIdentifier = getCadreIdentifier(cadreItem);
        if (cadreIdentifier == null || cadreCollectionIdentifiers.includes(cadreIdentifier)) {
          return false;
        }
        cadreCollectionIdentifiers.push(cadreIdentifier);
        return true;
      });
      return [...cadresToAdd, ...cadreCollection];
    }
    return cadreCollection;
  }
}
