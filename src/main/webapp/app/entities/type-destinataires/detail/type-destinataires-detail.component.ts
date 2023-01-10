import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITypeDestinataires } from '../type-destinataires.model';

@Component({
  selector: 'jhi-type-destinataires-detail',
  templateUrl: './type-destinataires-detail.component.html',
})
export class TypeDestinatairesDetailComponent implements OnInit {
  typeDestinataires: ITypeDestinataires | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeDestinataires }) => {
      this.typeDestinataires = typeDestinataires;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
