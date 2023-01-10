import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAugmentationBareme, AugmentationBareme } from '../augmentation-bareme.model';
import { AugmentationBaremeService } from '../service/augmentation-bareme.service';

@Injectable({ providedIn: 'root' })
export class AugmentationBaremeRoutingResolveService implements Resolve<IAugmentationBareme> {
  constructor(protected service: AugmentationBaremeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAugmentationBareme> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((augmentationBareme: HttpResponse<AugmentationBareme>) => {
          if (augmentationBareme.body) {
            return of(augmentationBareme.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AugmentationBareme());
  }
}
