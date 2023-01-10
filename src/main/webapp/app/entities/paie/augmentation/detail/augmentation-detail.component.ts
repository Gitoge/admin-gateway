import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAugmentation } from '../augmentation.model';

@Component({
  selector: 'jhi-augmentation-detail',
  templateUrl: './augmentation-detail.component.html',
})
export class AugmentationDetailComponent implements OnInit {
  augmentation: IAugmentation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ augmentation }) => {
      this.augmentation = augmentation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
