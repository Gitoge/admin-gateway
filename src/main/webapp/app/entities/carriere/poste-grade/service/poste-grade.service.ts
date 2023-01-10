import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPosteGrade, getPosteGradeIdentifier } from '../poste-grade.model';

export type EntityResponseType = HttpResponse<IPosteGrade>;
export type EntityArrayResponseType = HttpResponse<IPosteGrade[]>;

@Injectable({ providedIn: 'root' })
export class PosteGradeService {
  protected resourceUrl = this.applicationConfigService.getEndpointForCarriere('api/poste-grades');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(posteGrade: IPosteGrade): Observable<EntityResponseType> {
    return this.http.post<IPosteGrade>(this.resourceUrl, posteGrade, { observe: 'response' });
  }

  update(posteGrade: IPosteGrade): Observable<EntityResponseType> {
    return this.http.put<IPosteGrade>(`${this.resourceUrl}/${getPosteGradeIdentifier(posteGrade) as number}`, posteGrade, {
      observe: 'response',
    });
  }

  partialUpdate(posteGrade: IPosteGrade): Observable<EntityResponseType> {
    return this.http.patch<IPosteGrade>(`${this.resourceUrl}/${getPosteGradeIdentifier(posteGrade) as number}`, posteGrade, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPosteGrade>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPosteGrade[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPosteGradeToCollectionIfMissing(
    posteGradeCollection: IPosteGrade[],
    ...posteGradesToCheck: (IPosteGrade | null | undefined)[]
  ): IPosteGrade[] {
    const posteGrades: IPosteGrade[] = posteGradesToCheck.filter(isPresent);
    if (posteGrades.length > 0) {
      const posteGradeCollectionIdentifiers = posteGradeCollection.map(posteGradeItem => getPosteGradeIdentifier(posteGradeItem)!);
      const posteGradesToAdd = posteGrades.filter(posteGradeItem => {
        const posteGradeIdentifier = getPosteGradeIdentifier(posteGradeItem);
        if (posteGradeIdentifier == null || posteGradeCollectionIdentifiers.includes(posteGradeIdentifier)) {
          return false;
        }
        posteGradeCollectionIdentifiers.push(posteGradeIdentifier);
        return true;
      });
      return [...posteGradesToAdd, ...posteGradeCollection];
    }
    return posteGradeCollection;
  }
}
