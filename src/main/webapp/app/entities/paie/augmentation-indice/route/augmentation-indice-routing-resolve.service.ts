import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAugmentationIndice, AugmentationIndice } from '../augmentation-indice.model';
import { AugmentationIndiceService } from '../service/augmentation-indice.service';

@Injectable({ providedIn: 'root' })
export class AugmentationIndiceRoutingResolveService implements Resolve<IAugmentationIndice> {
  constructor(protected service: AugmentationIndiceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAugmentationIndice> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((augmentationIndice: HttpResponse<AugmentationIndice>) => {
          if (augmentationIndice.body) {
            return of(augmentationIndice.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AugmentationIndice());
  }
}
