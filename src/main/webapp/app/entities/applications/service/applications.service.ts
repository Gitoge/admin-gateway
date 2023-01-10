import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IApplications, getApplicationsIdentifier } from '../applications.model';

import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';

export type EntityResponseType = HttpResponse<IApplications>;
export type EntityArrayResponseType = HttpResponse<IApplications[]>;

@Injectable({ providedIn: 'root' })
export class ApplicationsService {
  public resourceUrl = this.applicationConfigService.getEndpointForBackend('api/applications');
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

  create(applications: IApplications): Observable<EntityResponseType> {
    return this.http.post<IApplications>(this.resourceUrl, applications, { headers: this.header, observe: 'response' });
  }

  update(applications: IApplications): Observable<HttpResponse<IApplications>> {
    return this.http.put<IApplications>(this.resourceUrl, applications, { headers: this.header, observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IApplications>(`${this.resourceUrl}/${id}`, { headers: this.header, observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IApplications[]>(this.resourceUrl, { params: options, headers: this.header, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { headers: this.header, observe: 'response' });
  }

  partialUpdate(applications: IApplications): Observable<EntityResponseType> {
    return this.http.patch<IApplications>(`${this.resourceUrl}/${getApplicationsIdentifier(applications) as number}`, applications, {
      observe: 'response',
    });
  }

  addApplicationsToCollectionIfMissing(
    applicationsCollection: IApplications[],
    ...applicationsToCheck: (IApplications | null | undefined)[]
  ): IApplications[] {
    const applications: IApplications[] = applicationsToCheck.filter(isPresent);
    if (applications.length > 0) {
      const applicationsCollectionIdentifiers = applicationsCollection.map(
        applicationsItem => getApplicationsIdentifier(applicationsItem)!
      );
      const applicationsToAdd = applications.filter(applicationsItem => {
        const applicationsIdentifier = getApplicationsIdentifier(applicationsItem);
        if (applicationsIdentifier == null || applicationsCollectionIdentifiers.includes(applicationsIdentifier)) {
          return false;
        }
        applicationsCollectionIdentifiers.push(applicationsIdentifier);
        return true;
      });
      return [...applicationsToAdd, ...applicationsCollection];
    }
    return applicationsCollection;
  }
  updateApp(applications: IApplications): Observable<EntityResponseType> {
    return this.http.put<IApplications>(`${this.resourceUrl}/${getApplicationsIdentifier(applications) as number}`, applications, {
      observe: 'response',
    });
  }
}
