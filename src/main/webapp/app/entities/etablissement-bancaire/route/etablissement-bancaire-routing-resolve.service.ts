import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEtablissementBancaire, EtablissementBancaire } from '../etablissement-bancaire.model';
import { EtablissementBancaireService } from '../service/etablissement-bancaire.service';

@Injectable({ providedIn: 'root' })
export class EtablissementBancaireRoutingResolveService implements Resolve<IEtablissementBancaire> {
  constructor(protected service: EtablissementBancaireService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEtablissementBancaire> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((etablissementBancaire: HttpResponse<EtablissementBancaire>) => {
          if (etablissementBancaire.body) {
            return of(etablissementBancaire.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new EtablissementBancaire());
  }
}
