import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IIndices } from '../indices.model';

@Component({
  selector: 'jhi-indices-detail',
  templateUrl: './indices-detail.component.html',
})
export class IndicesDetailComponent implements OnInit {
  indices: IIndices | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ indices }) => {
      this.indices = indices;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
