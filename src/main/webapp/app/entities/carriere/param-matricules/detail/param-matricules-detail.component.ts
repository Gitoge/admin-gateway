import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IParamMatricules } from '../param-matricules.model';

@Component({
  selector: 'jhi-param-matricules-detail',
  templateUrl: './param-matricules-detail.component.html',
})
export class ParamMatriculesDetailComponent implements OnInit {
  paramMatricules: IParamMatricules | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paramMatricules }) => {
      this.paramMatricules = paramMatricules;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
