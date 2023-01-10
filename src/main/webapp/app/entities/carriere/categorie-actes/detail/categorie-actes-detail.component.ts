import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICategorieActes } from '../categorie-actes.model';

@Component({
  selector: 'jhi-categorie-actes-detail',
  templateUrl: './categorie-actes-detail.component.html',
})
export class CategorieActesDetailComponent implements OnInit {
  categorieActes: ICategorieActes | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ categorieActes }) => {
      this.categorieActes = categorieActes;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
