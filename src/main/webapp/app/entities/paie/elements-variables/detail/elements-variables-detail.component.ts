import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IElementsVariables } from '../elements-variables.model';

@Component({
  selector: 'jhi-elements-variables-detail',
  templateUrl: './elements-variables-detail.component.html',
})
export class ElementsVariablesDetailComponent implements OnInit {
  elementsVariables: IElementsVariables | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ elementsVariables }) => {
      this.elementsVariables = elementsVariables;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
