import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICategorieActes, CategorieActes } from '../categorie-actes.model';
import { CategorieActesService } from '../service/categorie-actes.service';

@Injectable({ providedIn: 'root' })
export class CategorieActesRoutingResolveService implements Resolve<ICategorieActes> {
  constructor(protected service: CategorieActesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICategorieActes> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((categorieActes: HttpResponse<CategorieActes>) => {
          if (categorieActes.body) {
            return of(categorieActes.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CategorieActes());
  }
}
