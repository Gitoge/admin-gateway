import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IParamBaremeImposable } from '../param-bareme-imposable.model';

@Component({
  selector: 'jhi-param-bareme-imposable-detail',
  templateUrl: './param-bareme-imposable-detail.component.html',
})
export class ParamBaremeImposableDetailComponent implements OnInit {
  paramBaremeImposable: IParamBaremeImposable | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paramBaremeImposable }) => {
      this.paramBaremeImposable = paramBaremeImposable;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
