import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter, finalize, map } from 'rxjs/operators';

import { IModules, Modules } from '../modules.model';
import { ModulesService } from '../service/modules.service';
import { IPages } from 'app/entities/pages/pages.model';
import { IApplications } from 'app/entities/applications/applications.model';
import { ApplicationsService } from 'app/entities/applications/service/applications.service';
import { ITableValeur } from 'app/entities/table-valeur/table-valeur.model';
import { TableValeurService } from 'app/entities/table-valeur/service/table-valeur.service';
import { IPermissions } from 'app/shared/services/permissions';
import { PermissionsService } from 'app/shared/services/permissions.services';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-modules-update',
  templateUrl: './modules-update.component.html',
})
export class ModulesUpdateComponent implements OnInit {
  isSaving = false;
  displayStyle = 'none';

  titre!: string;
  module!: IModules;
  typeMessage?: string;
  _success = new Subject<string>();

  applications: IApplications[] = [];

  pages: IPages[] = [];

  editForm = this.fb.group({
    id: [],
    code: [],
    libelle: [],
    description: [],
    icon: [],
    ordre: [],
    routerLink: [],
    type: [],
    active: [],
    applications: [],
  });

  routerLinks?: ITableValeur[] = [];

  icons?: ITableValeur[] = [];

  CODE_PAGE = 'GES_MODULE';

  permissions?: IPermissions;

  constructor(
    protected tableValeurService: TableValeurService,
    protected modulesService: ModulesService,
    protected applicationsService: ApplicationsService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected permissionsService: PermissionsService
  ) {}

  ngOnInit(): void {
    this.permissions = this.permissionsService.getPermissions(this.CODE_PAGE, 'AJOUT');
    this.activatedRoute.data.subscribe(({ modules }) => {
      this.updateForm(modules);
      if (modules.id !== undefined && modules.id !== null) {
        this.titre = 'Modifier ce module';
      } else {
        this.titre = 'Ajouter un Module';
      }
      this.loadRelationshipsOptions();
    });

    this.tableValeurService
      .findRouterLinks()
      .pipe(
        filter((mayBeOk: HttpResponse<ITableValeur[]>) => mayBeOk.ok),
        map((res: HttpResponse<ITableValeur[]>) => res.body ?? [])
      )
      .subscribe((routerLinks: ITableValeur[]) => (this.routerLinks = routerLinks));

    this.tableValeurService
      .findIcons()
      .pipe(
        filter((mayBeOk: HttpResponse<ITableValeur[]>) => mayBeOk.ok),
        map((res: HttpResponse<ITableValeur[]>) => res.body ?? [])
      )
      .subscribe((icons: ITableValeur[]) => (this.icons = icons));
  }

  openPopup(): void {
    this.displayStyle = 'block';
  }

  closePopup(): void {
    this.displayStyle = 'none';
  }

  validPopup(): void {
    this.displayStyle = 'none';
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const modules = this.createFromForm();
    modules.active = true;
    if (modules.id !== undefined) {
      this.subscribeToSaveResponse(this.modulesService.update(modules));
    } else {
      this.subscribeToSaveResponse(this.modulesService.create(modules));
    }
  }

  delay(ms: number): any {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  refresh(): void {
    window.location.reload();
  }

  public afficheMessage(msg: string, typeMessage?: string): void {
    this.typeMessage = typeMessage;
    this._success.next(msg);
  }

  trackApplicationsById(_index: number, item: IApplications): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IModules>>): void {
    result.subscribe(
      (res: HttpResponse<IModules>) => this.onSaveSuccess(res.body),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(module: IModules | null): void {
    if (module !== null) {
      this.module = module;

      this.isSaving = false;
      (async () => {
        // Do something before delay
        this.afficheMessage('Opération effectuée avec succès.', 'success');

        await this.delay(3000);

        this.refresh();

        // Do something after
      })();

      if (this.module.id !== undefined) {
        Swal.fire(`<h4 style="font-family: Helvetica; font-size:16px"> Module <b>${module?.libelle ?? ''}</b> enregistré avec succès</h4>`);
      }

      this.previousState();
    }
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(modules: IModules): void {
    this.editForm.patchValue({
      id: modules.id,
      code: modules.code,
      libelle: modules.libelle,
      description: modules.description,
      icon: modules.icon,
      ordre: modules.ordre,
      routerLink: modules.routerLink,
      type: modules.type,
      active: modules.active,
      applications: modules.applications,
    });

    this.applications = this.applicationsService.addApplicationsToCollectionIfMissing(this.applications, modules.applications);
  }

  protected loadRelationshipsOptions(): void {
    this.applicationsService
      .query()
      .pipe(map((res: HttpResponse<IApplications[]>) => res.body ?? []))
      .pipe(
        map((applications: IApplications[]) =>
          this.applicationsService.addApplicationsToCollectionIfMissing(applications, this.editForm.get('applications')!.value)
        )
      )
      .subscribe((applications: IApplications[]) => (this.applications = applications));
  }

  protected createFromForm(): IModules {
    return {
      ...new Modules(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
      icon: this.editForm.get(['icon'])!.value,
      ordre: this.editForm.get(['ordre'])!.value,
      routerLink: this.editForm.get(['routerLink'])!.value,
      type: this.editForm.get(['type'])!.value,
      active: this.editForm.get(['active'])!.value,
      applications: this.editForm.get(['applications'])!.value,
    };
  }
}
