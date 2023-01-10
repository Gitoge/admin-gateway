import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAvancement, getAvancementIdentifier } from '../avancement.model';

export type EntityResponseType = HttpResponse<IAvancement>;
export type EntityArrayResponseType = HttpResponse<IAvancement[]>;

@Injectable({ providedIn: 'root' })
export class AvancementService {
  protected resourceUrl = this.applicationConfigService.getEndpointForCarriere('api/avancements');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(avancement: IAvancement): Observable<EntityResponseType> {
    return this.http.post<IAvancement>(this.resourceUrl, avancement, { observe: 'response' });
  }

  update(avancement: IAvancement): Observable<EntityResponseType> {
    return this.http.put<IAvancement>(`${this.resourceUrl}/${getAvancementIdentifier(avancement) as number}`, avancement, {
      observe: 'response',
    });
  }

  partialUpdate(avancement: IAvancement): Observable<EntityResponseType> {
    return this.http.patch<IAvancement>(`${this.resourceUrl}/${getAvancementIdentifier(avancement) as number}`, avancement, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAvancement>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAvancement[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAvancementToCollectionIfMissing(
    avancementCollection: IAvancement[],
    ...avancementsToCheck: (IAvancement | null | undefined)[]
  ): IAvancement[] {
    const avancements: IAvancement[] = avancementsToCheck.filter(isPresent);
    if (avancements.length > 0) {
      const avancementCollectionIdentifiers = avancementCollection.map(avancementItem => getAvancementIdentifier(avancementItem)!);
      const avancementsToAdd = avancements.filter(avancementItem => {
        const avancementIdentifier = getAvancementIdentifier(avancementItem);
        if (avancementIdentifier == null || avancementCollectionIdentifiers.includes(avancementIdentifier)) {
          return false;
        }
        avancementCollectionIdentifiers.push(avancementIdentifier);
        return true;
      });
      return [...avancementsToAdd, ...avancementCollection];
    }
    return avancementCollection;
  }
}
