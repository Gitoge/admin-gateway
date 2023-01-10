import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAssiettes } from '../assiettes.model';

@Component({
  selector: 'jhi-assiettes-detail',
  templateUrl: './assiettes-detail.component.html',
})
export class AssiettesDetailComponent implements OnInit {
  assiettes: IAssiettes | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ assiettes }) => {
      this.assiettes = assiettes;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
