import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITypeActes } from '../type-actes.model';

@Component({
  selector: 'jhi-type-actes-detail',
  templateUrl: './type-actes-detail.component.html',
})
export class TypeActesDetailComponent implements OnInit {
  typeActes: ITypeActes | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeActes }) => {
      this.typeActes = typeActes;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
