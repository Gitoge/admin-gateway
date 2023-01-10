import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStructureAdmin, StructureAdmin } from '../structure-admin.model';
import { StructureAdminService } from '../service/structure-admin.service';

@Injectable({ providedIn: 'root' })
export class StructureAdminRoutingResolveService implements Resolve<IStructureAdmin> {
  constructor(protected service: StructureAdminService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStructureAdmin> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((structureAdmin: HttpResponse<StructureAdmin>) => {
          if (structureAdmin.body) {
            return of(structureAdmin.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new StructureAdmin());
  }
}
