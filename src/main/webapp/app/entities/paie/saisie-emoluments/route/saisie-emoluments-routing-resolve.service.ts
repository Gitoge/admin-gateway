import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISaisieEmoluments, SaisieEmoluments } from '../saisie-emoluments.model';
import { SaisieEmolumentsService } from '../service/saisie-emoluments.service';

@Injectable({ providedIn: 'root' })
export class SaisieEmolumentsRoutingResolveService implements Resolve<ISaisieEmoluments> {
  constructor(protected service: SaisieEmolumentsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISaisieEmoluments> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((saisieEmoluments: HttpResponse<SaisieEmoluments>) => {
          if (saisieEmoluments.body) {
            return of(saisieEmoluments.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SaisieEmoluments());
  }
}
