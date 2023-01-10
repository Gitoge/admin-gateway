import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGrilleSoldeGlobal, getGrilleSoldeGlobalIdentifier } from '../grille-solde-global.model';

export type EntityResponseType = HttpResponse<IGrilleSoldeGlobal>;
export type EntityArrayResponseType = HttpResponse<IGrilleSoldeGlobal[]>;

@Injectable({ providedIn: 'root' })
export class GrilleSoldeGlobalService {
  // protected resourceUrl = this.applicationConfigService.getEndpointFor('api/grille-solde-globals', 'carriere');
  protected resourceUrl = this.applicationConfigService.getEndpointForCarriere('api/grille-solde-globals');

  protected resourceUrlByGradeHierarchieEchelon = this.applicationConfigService.getEndpointForCarriere(
    'api/grille-solde-globals/grade-hierarchie-echelon'
  );

  protected resourceUrlGSoldeGlobalRecherche = this.applicationConfigService.getEndpointForCarriere('api/grille-solde-globals/recherche');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(grilleSoldeGlobal: IGrilleSoldeGlobal): Observable<EntityResponseType> {
    return this.http.post<IGrilleSoldeGlobal>(this.resourceUrl, grilleSoldeGlobal, { observe: 'response' });
  }

  update(grilleSoldeGlobal: IGrilleSoldeGlobal): Observable<EntityResponseType> {
    return this.http.put<IGrilleSoldeGlobal>(
      `${this.resourceUrl}/${getGrilleSoldeGlobalIdentifier(grilleSoldeGlobal) as number}`,
      grilleSoldeGlobal,
      { observe: 'response' }
    );
  }

  partialUpdate(grilleSoldeGlobal: IGrilleSoldeGlobal): Observable<EntityResponseType> {
    return this.http.patch<IGrilleSoldeGlobal>(
      `${this.resourceUrl}/${getGrilleSoldeGlobalIdentifier(grilleSoldeGlobal) as number}`,
      grilleSoldeGlobal,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGrilleSoldeGlobal>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGrilleSoldeGlobal[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findGrilleSoldeGlobal(gradeId: number, hierarchieId: number, echelonId: number): Observable<EntityResponseType> {
    return this.http.get<IGrilleSoldeGlobal>(
      `${this.resourceUrlByGradeHierarchieEchelon}?gradeId=${gradeId}&hierarchieId=${hierarchieId}&echelonId=${echelonId}`,
      {
        observe: 'response',
      }
    );
  }

  findGSoldeGlobalByMotsCles(motCles: string, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGrilleSoldeGlobal[]>(`${this.resourceUrlGSoldeGlobalRecherche}?motCles=${motCles}`, {
      params: options,
      observe: 'response',
    });
  }

  addGrilleSoldeGlobalToCollectionIfMissing(
    grilleSoldeGlobalCollection: IGrilleSoldeGlobal[],
    ...grilleSoldeGlobalsToCheck: (IGrilleSoldeGlobal | null | undefined)[]
  ): IGrilleSoldeGlobal[] {
    const grilleSoldeGlobals: IGrilleSoldeGlobal[] = grilleSoldeGlobalsToCheck.filter(isPresent);
    if (grilleSoldeGlobals.length > 0) {
      const grilleSoldeGlobalCollectionIdentifiers = grilleSoldeGlobalCollection.map(
        grilleSoldeGlobalItem => getGrilleSoldeGlobalIdentifier(grilleSoldeGlobalItem)!
      );
      const grilleSoldeGlobalsToAdd = grilleSoldeGlobals.filter(grilleSoldeGlobalItem => {
        const grilleSoldeGlobalIdentifier = getGrilleSoldeGlobalIdentifier(grilleSoldeGlobalItem);
        if (grilleSoldeGlobalIdentifier == null || grilleSoldeGlobalCollectionIdentifiers.includes(grilleSoldeGlobalIdentifier)) {
          return false;
        }
        grilleSoldeGlobalCollectionIdentifiers.push(grilleSoldeGlobalIdentifier);
        return true;
      });
      return [...grilleSoldeGlobalsToAdd, ...grilleSoldeGlobalCollection];
    }
    return grilleSoldeGlobalCollection;
  }
}
