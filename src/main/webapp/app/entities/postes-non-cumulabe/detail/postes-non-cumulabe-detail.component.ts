import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPostesNonCumulabe } from '../postes-non-cumulabe.model';

@Component({
  selector: 'jhi-postes-non-cumulabe-detail',
  templateUrl: './postes-non-cumulabe-detail.component.html',
})
export class PostesNonCumulabeDetailComponent implements OnInit {
  postesNonCumulabe: IPostesNonCumulabe | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ postesNonCumulabe }) => {
      this.postesNonCumulabe = postesNonCumulabe;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
