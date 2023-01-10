import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IHierarchie } from '../hierarchie.model';

@Component({
  selector: 'jhi-hierarchie-detail',
  templateUrl: './hierarchie-detail.component.html',
})
export class HierarchieDetailComponent implements OnInit {
  hierarchie: IHierarchie | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ hierarchie }) => {
      this.hierarchie = hierarchie;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
