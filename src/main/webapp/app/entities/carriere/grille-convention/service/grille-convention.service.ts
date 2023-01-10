import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGrilleConvention, getGrilleConventionIdentifier } from '../grille-convention.model';

export type EntityResponseType = HttpResponse<IGrilleConvention>;
export type EntityArrayResponseType = HttpResponse<IGrilleConvention[]>;

@Injectable({ providedIn: 'root' })
export class GrilleConventionService {
  protected resourceUrl = this.applicationConfigService.getEndpointForCarriere('api/grille-conventions');
  protected resourceUrlEtablissement = this.applicationConfigService.getEndpointForCarriere('api/grille-conventions/etablissement');
  protected resourceUrlGrilleConvention = this.applicationConfigService.getEndpointForCarriere('api/grille-convention/grade-classe');
  protected resourceUrlGrilleConventionEntreprise = this.applicationConfigService.getEndpointForCarriere(
    'api/grille-convention/grade-categorie'
  );

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(grilleConvention: IGrilleConvention): Observable<EntityResponseType> {
    return this.http.post<IGrilleConvention>(this.resourceUrl, grilleConvention, { observe: 'response' });
  }

  update(grilleConvention: IGrilleConvention): Observable<EntityResponseType> {
    return this.http.put<IGrilleConvention>(
      `${this.resourceUrl}/${getGrilleConventionIdentifier(grilleConvention) as number}`,
      grilleConvention,
      { observe: 'response' }
    );
  }

  partialUpdate(grilleConvention: IGrilleConvention): Observable<EntityResponseType> {
    return this.http.patch<IGrilleConvention>(
      `${this.resourceUrl}/${getGrilleConventionIdentifier(grilleConvention) as number}`,
      grilleConvention,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGrilleConvention>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGrilleConvention[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findGrilleConvention(gradeId: number, classeId: number, categorieId: number, etablissementId: number): Observable<EntityResponseType> {
    return this.http.get<IGrilleConvention>(
      `${this.resourceUrlGrilleConvention}?gradeId=${gradeId}&classeId=${classeId}&categorieId=${categorieId}&etablissementId=${etablissementId}`,
      {
        observe: 'response',
      }
    );
  }

  findGrilleConventionByEtablissement(libelleEtablissement: string, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGrilleConvention[]>(`${this.resourceUrlEtablissement}?libelleEtablissement=${libelleEtablissement}`, {
      params: options,
      observe: 'response',
    });
  }

  findGrilleConventionEntreprise(gradeId: number, categorieId: number, etablissementId: number): Observable<EntityResponseType> {
    return this.http.get<IGrilleConvention>(
      `${this.resourceUrlGrilleConventionEntreprise}?gradeId=${gradeId}&categorieId=${categorieId}&etablissementId=${etablissementId}`,
      {
        observe: 'response',
      }
    );
  }

  addGrilleConventionToCollectionIfMissing(
    grilleConventionCollection: IGrilleConvention[],
    ...grilleConventionsToCheck: (IGrilleConvention | null | undefined)[]
  ): IGrilleConvention[] {
    const grilleConventions: IGrilleConvention[] = grilleConventionsToCheck.filter(isPresent);
    if (grilleConventions.length > 0) {
      const grilleConventionCollectionIdentifiers = grilleConventionCollection.map(
        grilleConventionItem => getGrilleConventionIdentifier(grilleConventionItem)!
      );
      const grilleConventionsToAdd = grilleConventions.filter(grilleConventionItem => {
        const grilleConventionIdentifier = getGrilleConventionIdentifier(grilleConventionItem);
        if (grilleConventionIdentifier == null || grilleConventionCollectionIdentifiers.includes(grilleConventionIdentifier)) {
          return false;
        }
        grilleConventionCollectionIdentifiers.push(grilleConventionIdentifier);
        return true;
      });
      return [...grilleConventionsToAdd, ...grilleConventionCollection];
    }
    return grilleConventionCollection;
  }
}
