import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IParamPartsFiscales } from '../param-parts-fiscales.model';

@Component({
  selector: 'jhi-param-parts-fiscales-detail',
  templateUrl: './param-parts-fiscales-detail.component.html',
})
export class ParamPartsFiscalesDetailComponent implements OnInit {
  paramPartsFiscales: IParamPartsFiscales | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paramPartsFiscales }) => {
      this.paramPartsFiscales = paramPartsFiscales;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
