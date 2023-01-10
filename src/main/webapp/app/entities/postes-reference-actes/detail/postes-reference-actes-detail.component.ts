import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPostesReferenceActes } from '../postes-reference-actes.model';

@Component({
  selector: 'jhi-postes-reference-actes-detail',
  templateUrl: './postes-reference-actes-detail.component.html',
})
export class PostesReferenceActesDetailComponent implements OnInit {
  postesReferenceActes: IPostesReferenceActes | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ postesReferenceActes }) => {
      this.postesReferenceActes = postesReferenceActes;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
