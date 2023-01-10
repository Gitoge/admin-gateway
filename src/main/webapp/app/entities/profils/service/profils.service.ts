import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProfils, getProfilsIdentifier } from '../profils.model';

export type EntityResponseType = HttpResponse<IProfils>;
export type EntityArrayResponseType = HttpResponse<IProfils[]>;

@Injectable({ providedIn: 'root' })
export class ProfilsService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/profils');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(profils: IProfils): Observable<EntityResponseType> {
    return this.http.post<IProfils>(this.resourceUrl, profils, { observe: 'response' });
  }

  update(profils: IProfils): Observable<EntityResponseType> {
    return this.http.put<IProfils>(`${this.resourceUrl}/${getProfilsIdentifier(profils) as number}`, profils, { observe: 'response' });
  }

  partialUpdate(profils: IProfils): Observable<EntityResponseType> {
    return this.http.patch<IProfils>(`${this.resourceUrl}/${getProfilsIdentifier(profils) as number}`, profils, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProfils>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProfils[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addProfilsToCollectionIfMissing(profilsCollection: IProfils[], ...profilsToCheck: (IProfils | null | undefined)[]): IProfils[] {
    const profils: IProfils[] = profilsToCheck.filter(isPresent);
    if (profils.length > 0) {
      const profilsCollectionIdentifiers = profilsCollection.map(profilsItem => getProfilsIdentifier(profilsItem)!);
      const profilsToAdd = profils.filter(profilsItem => {
        const profilsIdentifier = getProfilsIdentifier(profilsItem);
        if (profilsIdentifier == null || profilsCollectionIdentifiers.includes(profilsIdentifier)) {
          return false;
        }
        profilsCollectionIdentifiers.push(profilsIdentifier);
        return true;
      });
      return [...profilsToAdd, ...profilsCollection];
    }
    return profilsCollection;
  }
}
