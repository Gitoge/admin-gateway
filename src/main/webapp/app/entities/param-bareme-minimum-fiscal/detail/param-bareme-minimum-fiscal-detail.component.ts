import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IParamBaremeMinimumFiscal } from '../param-bareme-minimum-fiscal.model';

@Component({
  selector: 'jhi-param-bareme-minimum-fiscal-detail',
  templateUrl: './param-bareme-minimum-fiscal-detail.component.html',
})
export class ParamBaremeMinimumFiscalDetailComponent implements OnInit {
  paramBaremeMinimumFiscal: IParamBaremeMinimumFiscal | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paramBaremeMinimumFiscal }) => {
      this.paramBaremeMinimumFiscal = paramBaremeMinimumFiscal;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
