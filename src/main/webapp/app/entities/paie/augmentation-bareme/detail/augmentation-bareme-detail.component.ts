import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAugmentationBareme } from '../augmentation-bareme.model';

@Component({
  selector: 'jhi-augmentation-bareme-detail',
  templateUrl: './augmentation-bareme-detail.component.html',
})
export class AugmentationBaremeDetailComponent implements OnInit {
  augmentationBareme: IAugmentationBareme | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ augmentationBareme }) => {
      this.augmentationBareme = augmentationBareme;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
