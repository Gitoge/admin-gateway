import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserExtended } from '../user-extended.model';

@Component({
  selector: 'jhi-user-extended-detail',
  templateUrl: './user-extended-detail.component.html',
})
export class UserExtendedDetailComponent implements OnInit {
  userExtended: IUserExtended | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userExtended }) => {
      this.userExtended = userExtended;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
