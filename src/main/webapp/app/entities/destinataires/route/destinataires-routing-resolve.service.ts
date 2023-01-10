import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDestinataires, Destinataires } from '../destinataires.model';
import { DestinatairesService } from '../service/destinataires.service';

@Injectable({ providedIn: 'root' })
export class DestinatairesRoutingResolveService implements Resolve<IDestinataires> {
  constructor(protected service: DestinatairesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDestinataires> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((destinataires: HttpResponse<Destinataires>) => {
          if (destinataires.body) {
            return of(destinataires.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Destinataires());
  }
}
