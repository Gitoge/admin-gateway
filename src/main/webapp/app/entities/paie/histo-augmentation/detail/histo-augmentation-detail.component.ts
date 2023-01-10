import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IHistoAugmentation } from '../histo-augmentation.model';

@Component({
  selector: 'jhi-histo-augmentation-detail',
  templateUrl: './histo-augmentation-detail.component.html',
})
export class HistoAugmentationDetailComponent implements OnInit {
  histoAugmentation: IHistoAugmentation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ histoAugmentation }) => {
      this.histoAugmentation = histoAugmentation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
