import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStructureAdmin } from '../structure-admin.model';

@Component({
  selector: 'jhi-structure-admin-detail',
  templateUrl: './structure-admin-detail.component.html',
})
export class StructureAdminDetailComponent implements OnInit {
  structureAdmin: IStructureAdmin | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ structureAdmin }) => {
      this.structureAdmin = structureAdmin;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
