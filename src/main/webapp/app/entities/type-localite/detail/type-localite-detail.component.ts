import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITypeLocalite } from '../type-localite.model';

@Component({
  selector: 'jhi-type-localite-detail',
  templateUrl: './type-localite-detail.component.html',
})
export class TypeLocaliteDetailComponent implements OnInit {
  typeLocalite: ITypeLocalite | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeLocalite }) => {
      this.typeLocalite = typeLocalite;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
