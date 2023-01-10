import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITypeReglement } from '../type-reglement.model';

@Component({
  selector: 'jhi-type-reglement-detail',
  templateUrl: './type-reglement-detail.component.html',
})
export class TypeReglementDetailComponent implements OnInit {
  typeReglement: ITypeReglement | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeReglement }) => {
      this.typeReglement = typeReglement;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
