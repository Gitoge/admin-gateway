import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGrilleIndiciaire, getGrilleIndiciaireIdentifier } from '../grille-indiciaire.model';

export type EntityResponseType = HttpResponse<IGrilleIndiciaire>;
export type EntityArrayResponseType = HttpResponse<IGrilleIndiciaire[]>;

@Injectable({ providedIn: 'root' })
export class GrilleIndiciaireService {
  protected resourceUrl = this.applicationConfigService.getEndpointForCarriere('api/grille-indiciaires');

  protected resourceUrlGrade = this.applicationConfigService.getEndpointForCarriere('api/grille-indiciaires/grade-indices');

  protected resourceUrlGIndicesRecherche = this.applicationConfigService.getEndpointForCarriere('api/grille-indiciaires/recherche');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(grilleIndiciaire: IGrilleIndiciaire): Observable<EntityResponseType> {
    return this.http.post<IGrilleIndiciaire>(this.resourceUrl, grilleIndiciaire, { observe: 'response' });
  }

  update(grilleIndiciaire: IGrilleIndiciaire): Observable<EntityResponseType> {
    return this.http.put<IGrilleIndiciaire>(
      `${this.resourceUrl}/${getGrilleIndiciaireIdentifier(grilleIndiciaire) as number}`,
      grilleIndiciaire,
      { observe: 'response' }
    );
  }

  partialUpdate(grilleIndiciaire: IGrilleIndiciaire): Observable<EntityResponseType> {
    return this.http.patch<IGrilleIndiciaire>(
      `${this.resourceUrl}/${getGrilleIndiciaireIdentifier(grilleIndiciaire) as number}`,
      grilleIndiciaire,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGrilleIndiciaire>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGrilleIndiciaire[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findGIndicesByMotsCles(motCles: string, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGrilleIndiciaire[]>(`${this.resourceUrlGIndicesRecherche}?motCles=${motCles}`, {
      params: options,
      observe: 'response',
    });
  }

  addGrilleIndiciaireToCollectionIfMissing(
    grilleIndiciaireCollection: IGrilleIndiciaire[],
    ...grilleIndiciairesToCheck: (IGrilleIndiciaire | null | undefined)[]
  ): IGrilleIndiciaire[] {
    const grilleIndiciaires: IGrilleIndiciaire[] = grilleIndiciairesToCheck.filter(isPresent);
    if (grilleIndiciaires.length > 0) {
      const grilleIndiciaireCollectionIdentifiers = grilleIndiciaireCollection.map(
        grilleIndiciaireItem => getGrilleIndiciaireIdentifier(grilleIndiciaireItem)!
      );
      const grilleIndiciairesToAdd = grilleIndiciaires.filter(grilleIndiciaireItem => {
        const grilleIndiciaireIdentifier = getGrilleIndiciaireIdentifier(grilleIndiciaireItem);
        if (grilleIndiciaireIdentifier == null || grilleIndiciaireCollectionIdentifiers.includes(grilleIndiciaireIdentifier)) {
          return false;
        }
        grilleIndiciaireCollectionIdentifiers.push(grilleIndiciaireIdentifier);
        return true;
      });
      return [...grilleIndiciairesToAdd, ...grilleIndiciaireCollection];
    }
    return grilleIndiciaireCollection;
  }

  findGradeAndIndices(gradeId: number, indiceId: number): Observable<EntityResponseType> {
    return this.http.get<IGrilleIndiciaire>(`${this.resourceUrlGrade}?gradeId=${gradeId}&indiceId=${indiceId}`, {
      observe: 'response',
    });
  }

  // findByHierarchieAndEchelon(hierarchieId: number, echelonId: number): Observable<EntityResponseTypeGrille> {
  //   return this.http
  //     .get<IGrilleIndiciaire>(`${this.resourceUrl}/?hierarchieId=${hierarchieId}/&echelonId=${echelonId}`, {
  //       observe: 'response',
  //     })
  //     .pipe(map((res: EntityResponseTypeGrille) => this.convertDateFromServer(res)));
  // }
}
