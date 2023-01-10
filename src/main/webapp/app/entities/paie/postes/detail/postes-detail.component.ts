import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPostes } from '../postes.model';

@Component({
  selector: 'jhi-postes-detail',
  templateUrl: './postes-detail.component.html',
})
export class PostesDetailComponent implements OnInit {
  postes: IPostes | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ postes }) => {
      this.postes = postes;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
