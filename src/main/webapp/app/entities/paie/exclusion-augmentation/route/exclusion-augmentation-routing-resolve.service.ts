import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IExclusionAugmentation, ExclusionAugmentation } from '../exclusion-augmentation.model';
import { ExclusionAugmentationService } from '../service/exclusion-augmentation.service';

@Injectable({ providedIn: 'root' })
export class ExclusionAugmentationRoutingResolveService implements Resolve<IExclusionAugmentation> {
  constructor(protected service: ExclusionAugmentationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IExclusionAugmentation> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((exclusionAugmentation: HttpResponse<ExclusionAugmentation>) => {
          if (exclusionAugmentation.body) {
            return of(exclusionAugmentation.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ExclusionAugmentation());
  }
}
