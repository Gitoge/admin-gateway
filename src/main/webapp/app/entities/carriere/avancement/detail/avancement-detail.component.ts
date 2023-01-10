import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAvancement } from '../avancement.model';

@Component({
  selector: 'jhi-avancement-detail',
  templateUrl: './avancement-detail.component.html',
})
export class AvancementDetailComponent implements OnInit {
  avancement: IAvancement | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ avancement }) => {
      this.avancement = avancement;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
