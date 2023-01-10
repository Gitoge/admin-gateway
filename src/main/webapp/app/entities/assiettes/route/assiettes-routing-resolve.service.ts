import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAssiettes, Assiettes } from '../assiettes.model';
import { AssiettesService } from '../service/assiettes.service';

@Injectable({ providedIn: 'root' })
export class AssiettesRoutingResolveService implements Resolve<IAssiettes> {
  constructor(protected service: AssiettesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAssiettes> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((assiettes: HttpResponse<Assiettes>) => {
          if (assiettes.body) {
            return of(assiettes.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Assiettes());
  }
}
