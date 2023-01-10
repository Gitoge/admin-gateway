import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IActions } from '../actions.model';

@Component({
  selector: 'jhi-actions-detail',
  templateUrl: './actions-detail.component.html',
})
export class ActionsDetailComponent implements OnInit {
  actions: IActions | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ actions }) => {
      this.actions = actions;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
