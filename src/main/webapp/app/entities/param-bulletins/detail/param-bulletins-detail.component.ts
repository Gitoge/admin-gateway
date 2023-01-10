import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IParamBulletins } from '../param-bulletins.model';

@Component({
  selector: 'jhi-param-bulletins-detail',
  templateUrl: './param-bulletins-detail.component.html',
})
export class ParamBulletinsDetailComponent implements OnInit {
  paramBulletins: IParamBulletins | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paramBulletins }) => {
      this.paramBulletins = paramBulletins;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
