import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { INatureActes } from '../nature-actes.model';

@Component({
  selector: 'jhi-nature-actes-detail',
  templateUrl: './nature-actes-detail.component.html',
})
export class NatureActesDetailComponent implements OnInit {
  natureActes: INatureActes | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ natureActes }) => {
      this.natureActes = natureActes;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
