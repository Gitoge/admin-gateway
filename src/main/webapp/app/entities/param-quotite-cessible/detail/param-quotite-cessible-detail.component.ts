import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IParamQuotiteCessible } from '../param-quotite-cessible.model';

@Component({
  selector: 'jhi-param-quotite-cessible-detail',
  templateUrl: './param-quotite-cessible-detail.component.html',
})
export class ParamQuotiteCessibleDetailComponent implements OnInit {
  paramQuotiteCessible: IParamQuotiteCessible | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paramQuotiteCessible }) => {
      this.paramQuotiteCessible = paramQuotiteCessible;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
