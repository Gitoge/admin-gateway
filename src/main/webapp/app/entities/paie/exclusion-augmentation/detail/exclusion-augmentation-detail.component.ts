import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IExclusionAugmentation } from '../exclusion-augmentation.model';

@Component({
  selector: 'jhi-exclusion-augmentation-detail',
  templateUrl: './exclusion-augmentation-detail.component.html',
})
export class ExclusionAugmentationDetailComponent implements OnInit {
  exclusionAugmentation: IExclusionAugmentation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ exclusionAugmentation }) => {
      this.exclusionAugmentation = exclusionAugmentation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
