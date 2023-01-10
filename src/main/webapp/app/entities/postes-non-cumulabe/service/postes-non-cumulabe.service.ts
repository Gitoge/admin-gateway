import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPostesNonCumulabe, getPostesNonCumulabeIdentifier } from '../postes-non-cumulabe.model';

export type EntityResponseType = HttpResponse<IPostesNonCumulabe>;
export type EntityArrayResponseType = HttpResponse<IPostesNonCumulabe[]>;

@Injectable({ providedIn: 'root' })
export class PostesNonCumulabeService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/postes-non-cumulables');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(postesNonCumulabe: IPostesNonCumulabe): Observable<EntityResponseType> {
    return this.http.post<IPostesNonCumulabe>(this.resourceUrl, postesNonCumulabe, { observe: 'response' });
  }

  update(postesNonCumulabe: IPostesNonCumulabe): Observable<EntityResponseType> {
    return this.http.put<IPostesNonCumulabe>(
      `${this.resourceUrl}/${getPostesNonCumulabeIdentifier(postesNonCumulabe) as number}`,
      postesNonCumulabe,
      { observe: 'response' }
    );
  }

  partialUpdate(postesNonCumulabe: IPostesNonCumulabe): Observable<EntityResponseType> {
    return this.http.patch<IPostesNonCumulabe>(
      `${this.resourceUrl}/${getPostesNonCumulabeIdentifier(postesNonCumulabe) as number}`,
      postesNonCumulabe,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPostesNonCumulabe>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPostesNonCumulabe[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPostesNonCumulabeToCollectionIfMissing(
    postesNonCumulabeCollection: IPostesNonCumulabe[],
    ...postesNonCumulabesToCheck: (IPostesNonCumulabe | null | undefined)[]
  ): IPostesNonCumulabe[] {
    const postesNonCumulabes: IPostesNonCumulabe[] = postesNonCumulabesToCheck.filter(isPresent);
    if (postesNonCumulabes.length > 0) {
      const postesNonCumulabeCollectionIdentifiers = postesNonCumulabeCollection.map(
        postesNonCumulabeItem => getPostesNonCumulabeIdentifier(postesNonCumulabeItem)!
      );
      const postesNonCumulabesToAdd = postesNonCumulabes.filter(postesNonCumulabeItem => {
        const postesNonCumulabeIdentifier = getPostesNonCumulabeIdentifier(postesNonCumulabeItem);
        if (postesNonCumulabeIdentifier == null || postesNonCumulabeCollectionIdentifiers.includes(postesNonCumulabeIdentifier)) {
          return false;
        }
        postesNonCumulabeCollectionIdentifiers.push(postesNonCumulabeIdentifier);
        return true;
      });
      return [...postesNonCumulabesToAdd, ...postesNonCumulabeCollection];
    }
    return postesNonCumulabeCollection;
  }
}
