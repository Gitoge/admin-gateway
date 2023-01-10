import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITypeGrille } from '../type-grille.model';

@Component({
  selector: 'jhi-type-grille-detail',
  templateUrl: './type-grille-detail.component.html',
})
export class TypeGrilleDetailComponent implements OnInit {
  typeGrille: ITypeGrille | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeGrille }) => {
      this.typeGrille = typeGrille;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
