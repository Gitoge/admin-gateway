import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITableValeur, TableValeur } from '../table-valeur.model';
import { TableValeurService } from '../service/table-valeur.service';

@Injectable({ providedIn: 'root' })
export class TableValeurRoutingResolveService implements Resolve<ITableValeur> {
  constructor(protected service: TableValeurService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITableValeur> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((tableValeur: HttpResponse<TableValeur>) => {
          if (tableValeur.body) {
            return of(tableValeur.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TableValeur());
  }
}
