import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDiplomes } from '../diplomes.model';

@Component({
  selector: 'jhi-diplomes-detail',
  templateUrl: './diplomes-detail.component.html',
})
export class DiplomesDetailComponent implements OnInit {
  diplomes: IDiplomes | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ diplomes }) => {
      this.diplomes = diplomes;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
