import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAugmentationHierarchie, AugmentationHierarchie } from '../augmentation-hierarchie.model';
import { AugmentationHierarchieService } from '../service/augmentation-hierarchie.service';

@Injectable({ providedIn: 'root' })
export class AugmentationHierarchieRoutingResolveService implements Resolve<IAugmentationHierarchie> {
  constructor(protected service: AugmentationHierarchieService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAugmentationHierarchie> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((augmentationHierarchie: HttpResponse<AugmentationHierarchie>) => {
          if (augmentationHierarchie.body) {
            return of(augmentationHierarchie.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AugmentationHierarchie());
  }
}
