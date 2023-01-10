import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGrade, getGradeIdentifier } from '../grade.model';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';

export type EntityResponseType = HttpResponse<IGrade>;
export type EntityArrayResponseType = HttpResponse<IGrade[]>;

@Injectable({ providedIn: 'root' })
export class GradeService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/grades');
  protected resourceUrlDtails = this.applicationConfigService.getEndpointForBackend('api/grade');
  protected resourceUrlCodeGrade = this.applicationConfigService.getEndpointForBackend('api/grades/code-grade');

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

  create(grade: IGrade): Observable<EntityResponseType> {
    return this.http.post<IGrade>(this.resourceUrl, grade, { observe: 'response' });
  }

  update(grade: IGrade): Observable<EntityResponseType> {
    return this.http.put<IGrade>(`${this.resourceUrl}/${getGradeIdentifier(grade) as number}`, grade, { observe: 'response' });
  }

  partialUpdate(grade: IGrade): Observable<EntityResponseType> {
    return this.http.patch<IGrade>(`${this.resourceUrl}/${getGradeIdentifier(grade) as number}`, grade, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGrade>(`${this.resourceUrlDtails}/${id}`, { observe: 'response' });
  }

  findAll(): Observable<EntityArrayResponseType> {
    return this.http.get<IGrade[]>(`${this.resourceUrl}/all`, { headers: this.header, observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGrade[]>(this.resourceUrl, { params: options, observe: 'response' });
  }
  recherche(motCle: string, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGrade[]>(`${this.resourceUrl}/recherches?motCle=${motCle}`, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByCode(code: string): Observable<EntityResponseType> {
    return this.http.get<IGrade>(`${this.resourceUrlCodeGrade}?code=${code}`, { observe: 'response' });
  }

  addGradeToCollectionIfMissing(gradeCollection: IGrade[], ...gradesToCheck: (IGrade | null | undefined)[]): IGrade[] {
    const grades: IGrade[] = gradesToCheck.filter(isPresent);
    if (grades.length > 0) {
      const gradeCollectionIdentifiers = gradeCollection.map(gradeItem => getGradeIdentifier(gradeItem)!);
      const gradesToAdd = grades.filter(gradeItem => {
        const gradeIdentifier = getGradeIdentifier(gradeItem);
        if (gradeIdentifier == null || gradeCollectionIdentifiers.includes(gradeIdentifier)) {
          return false;
        }
        gradeCollectionIdentifiers.push(gradeIdentifier);
        return true;
      });
      return [...gradesToAdd, ...gradeCollection];
    }
    return gradeCollection;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      // res.body.dateEffet = res.body.dateEffet ? dayjs(res.body.dateEffet) : undefined;
      // res.body.dateEcheance = res.body.dateEcheance ? dayjs(res.body.dateEcheance) : undefined;
      // res.body.formule = res.body.formule ? dayjs(res.body.formule) : undefined;
      // res.body.dateInsert = res.body.dateInsert ? dayjs(res.body.dateInsert) : undefined;
      // res.body.dateUpdate = res.body.dateUpdate ? dayjs(res.body.dateUpdate) : undefined;
    }
    return res;
  }
}
