import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDocumentAdministratif, DocumentAdministratif } from '../document-administratif.model';
import { DocumentAdministratifService } from '../service/document-administratif.service';

@Injectable({ providedIn: 'root' })
export class DocumentAdministratifRoutingResolveService implements Resolve<IDocumentAdministratif> {
  constructor(protected service: DocumentAdministratifService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDocumentAdministratif> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((documentAdministratif: HttpResponse<DocumentAdministratif>) => {
          if (documentAdministratif.body) {
            return of(documentAdministratif.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new DocumentAdministratif());
  }
}
