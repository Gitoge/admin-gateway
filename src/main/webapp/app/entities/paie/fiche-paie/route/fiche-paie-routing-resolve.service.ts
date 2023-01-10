import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFichePaie, FichePaie } from '../fiche-paie.model';
import { FichePaieService } from '../service/fiche-paie.service';

@Injectable({ providedIn: 'root' })
export class FichePaieRoutingResolveService implements Resolve<IFichePaie> {
  constructor(protected service: FichePaieService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFichePaie> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((fichePaie: HttpResponse<FichePaie>) => {
          if (fichePaie.body) {
            return of(fichePaie.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new FichePaie());
  }
}
