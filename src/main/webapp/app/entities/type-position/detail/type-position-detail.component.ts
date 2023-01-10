import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITypePosition } from '../type-position.model';

@Component({
  selector: 'jhi-type-position-detail',
  templateUrl: './type-position-detail.component.html',
})
export class TypePositionDetailComponent implements OnInit {
  typePosition: ITypePosition | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typePosition }) => {
      this.typePosition = typePosition;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
