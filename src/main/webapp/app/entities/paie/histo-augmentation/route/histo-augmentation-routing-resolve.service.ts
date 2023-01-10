import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHistoAugmentation, HistoAugmentation } from '../histo-augmentation.model';
import { HistoAugmentationService } from '../service/histo-augmentation.service';

@Injectable({ providedIn: 'root' })
export class HistoAugmentationRoutingResolveService implements Resolve<IHistoAugmentation> {
  constructor(protected service: HistoAugmentationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHistoAugmentation> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((histoAugmentation: HttpResponse<HistoAugmentation>) => {
          if (histoAugmentation.body) {
            return of(histoAugmentation.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new HistoAugmentation());
  }
}
