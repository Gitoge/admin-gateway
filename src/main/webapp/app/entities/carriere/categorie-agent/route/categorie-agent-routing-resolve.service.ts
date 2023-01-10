import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICategorieAgent, CategorieAgent } from '../categorie-agent.model';
import { CategorieAgentService } from '../service/categorie-agent.service';

@Injectable({ providedIn: 'root' })
export class CategorieAgentRoutingResolveService implements Resolve<ICategorieAgent> {
  constructor(protected service: CategorieAgentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICategorieAgent> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((categorieAgent: HttpResponse<CategorieAgent>) => {
          if (categorieAgent.body) {
            return of(categorieAgent.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CategorieAgent());
  }
}
