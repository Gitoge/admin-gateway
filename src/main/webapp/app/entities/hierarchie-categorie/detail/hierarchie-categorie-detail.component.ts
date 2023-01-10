import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IHierarchieCategorie } from '../hierarchie-categorie.model';

@Component({
  selector: 'jhi-hierarchie-categorie-detail',
  templateUrl: './hierarchie-categorie-detail.component.html',
})
export class HierarchieCategorieDetailComponent implements OnInit {
  hierarchieCategorie: IHierarchieCategorie | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ hierarchieCategorie }) => {
      this.hierarchieCategorie = hierarchieCategorie;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
