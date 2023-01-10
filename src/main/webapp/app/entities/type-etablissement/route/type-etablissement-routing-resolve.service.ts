import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITypeEtablissement, TypeEtablissement } from '../type-etablissement.model';
import { TypeEtablissementService } from '../service/type-etablissement.service';

@Injectable({ providedIn: 'root' })
export class TypeEtablissementRoutingResolveService implements Resolve<ITypeEtablissement> {
  constructor(protected service: TypeEtablissementService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITypeEtablissement> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((typeEtablissement: HttpResponse<TypeEtablissement>) => {
          if (typeEtablissement.body) {
            return of(typeEtablissement.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TypeEtablissement());
  }
}
