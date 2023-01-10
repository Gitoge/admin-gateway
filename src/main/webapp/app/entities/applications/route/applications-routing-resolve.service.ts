import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IApplications, Applications } from '../applications.model';
import { ApplicationsService } from '../service/applications.service';

@Injectable({ providedIn: 'root' })
export class ApplicationsRoutingResolveService implements Resolve<IApplications> {
  constructor(protected service: ApplicationsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IApplications> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((applications: HttpResponse<Applications>) => {
          if (applications.body) {
            return of(applications.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Applications());
  }
}
