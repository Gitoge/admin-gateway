import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITypeDestinataires, TypeDestinataires } from '../type-destinataires.model';
import { TypeDestinatairesService } from '../service/type-destinataires.service';

@Injectable({ providedIn: 'root' })
export class TypeDestinatairesRoutingResolveService implements Resolve<ITypeDestinataires> {
  constructor(protected service: TypeDestinatairesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITypeDestinataires> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((typeDestinataires: HttpResponse<TypeDestinataires>) => {
          if (typeDestinataires.body) {
            return of(typeDestinataires.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TypeDestinataires());
  }
}
