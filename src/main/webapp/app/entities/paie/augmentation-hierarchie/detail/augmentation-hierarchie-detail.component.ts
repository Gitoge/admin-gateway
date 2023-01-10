import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAugmentationHierarchie } from '../augmentation-hierarchie.model';

@Component({
  selector: 'jhi-augmentation-hierarchie-detail',
  templateUrl: './augmentation-hierarchie-detail.component.html',
})
export class AugmentationHierarchieDetailComponent implements OnInit {
  augmentationHierarchie: IAugmentationHierarchie | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ augmentationHierarchie }) => {
      this.augmentationHierarchie = augmentationHierarchie;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
