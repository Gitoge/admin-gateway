import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEmoluments, Emoluments } from '../emoluments.model';
import { EmolumentsService } from '../service/emoluments.service';

@Injectable({ providedIn: 'root' })
export class EmolumentsRoutingResolveService implements Resolve<IEmoluments> {
  constructor(protected service: EmolumentsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEmoluments> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((emoluments: HttpResponse<Emoluments>) => {
          if (emoluments.body) {
            return of(emoluments.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Emoluments());
  }
}
