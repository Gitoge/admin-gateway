import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITableTypeValeur, TableTypeValeur } from '../table-type-valeur.model';
import { TableTypeValeurService } from '../service/table-type-valeur.service';

@Injectable({ providedIn: 'root' })
export class TableTypeValeurRoutingResolveService implements Resolve<ITableTypeValeur> {
  constructor(protected service: TableTypeValeurService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITableTypeValeur> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((tableTypeValeur: HttpResponse<TableTypeValeur>) => {
          if (tableTypeValeur.body) {
            return of(tableTypeValeur.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TableTypeValeur());
  }
}
