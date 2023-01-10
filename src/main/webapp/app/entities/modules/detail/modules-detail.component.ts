import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPermissions } from 'app/shared/services/permissions';
import { PermissionsService } from 'app/shared/services/permissions.services';

import { IModules } from '../modules.model';

@Component({
  selector: 'jhi-modules-detail',
  templateUrl: './modules-detail.component.html',
})
export class ModulesDetailComponent implements OnInit {
  modules: IModules | null = null;

  CODE_PAGE = 'GES_MODULE';

  permissions?: IPermissions;

  constructor(protected activatedRoute: ActivatedRoute, protected permissionsService: PermissionsService) {}

  ngOnInit(): void {
    this.permissions = this.permissionsService.getPermissions(this.CODE_PAGE, 'CONS');
    this.activatedRoute.data.subscribe(({ modules }) => {
      this.modules = modules;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
