import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAugmentationIndice } from '../augmentation-indice.model';

@Component({
  selector: 'jhi-augmentation-indice-detail',
  templateUrl: './augmentation-indice-detail.component.html',
})
export class AugmentationIndiceDetailComponent implements OnInit {
  augmentationIndice: IAugmentationIndice | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ augmentationIndice }) => {
      this.augmentationIndice = augmentationIndice;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
