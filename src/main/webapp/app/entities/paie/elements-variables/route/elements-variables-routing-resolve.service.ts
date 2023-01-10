import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IElementsVariables, ElementsVariables } from '../elements-variables.model';
import { ElementsVariablesService } from '../service/elements-variables.service';

@Injectable({ providedIn: 'root' })
export class ElementsVariablesRoutingResolveService implements Resolve<IElementsVariables> {
  constructor(protected service: ElementsVariablesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IElementsVariables> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((elementsVariables: HttpResponse<ElementsVariables>) => {
          if (elementsVariables.body) {
            return of(elementsVariables.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ElementsVariables());
  }
}
