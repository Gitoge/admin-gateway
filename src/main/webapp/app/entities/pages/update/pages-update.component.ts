import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, finalize, map } from 'rxjs/operators';

import { IPages, Pages } from '../pages.model';
import { PagesService } from '../service/pages.service';
import { ApplicationsService } from 'app/entities/applications/service/applications.service';
import { IModules } from 'app/entities/modules/modules.model';
import { ModulesService } from 'app/entities/modules/service/modules.service';
import { IActions } from 'app/entities/actions/actions.model';
import { ActionsService } from 'app/entities/actions/service/actions.service';
import { ITableValeur } from 'app/entities/table-valeur/table-valeur.model';
import { TableValeurService } from 'app/entities/table-valeur/service/table-valeur.service';

@Component({
  selector: 'jhi-pages-update',
  templateUrl: './pages-update.component.html',
})
export class PagesUpdateComponent implements OnInit {
  isSaving = false;

  titre!: string;

  modules: IModules[] = [];

  actionsSharedCollection: IActions[] = [];

  editForm = this.fb.group({
    id: [],
    code: [],
    libelle: [],
    description: [],
    modules: [],
    actions: [],
    routerLink: [],
    ordre: [],
    active: [],
  });
  active!: boolean;

  routerLinks?: ITableValeur[] = [];

  constructor(
    protected tableValeurService: TableValeurService,
    protected pagesService: PagesService,
    protected actionsService: ActionsService,
    protected activatedRoute: ActivatedRoute,
    protected applicationsService: ApplicationsService,
    protected modulesService: ModulesService,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pages }) => {
      this.updateForm(pages);

      if (pages.id !== undefined && pages.id !== null) {
        this.titre = 'Modifier cette Page';
      } else {
        this.titre = 'Ajouter une Page';
      }
      this.loadRelationshipsOptions();
    });
    this.active = true;

    this.tableValeurService
      .findRouterLinks()
      .pipe(
        filter((mayBeOk: HttpResponse<ITableValeur[]>) => mayBeOk.ok),
        map((res: HttpResponse<ITableValeur[]>) => res.body ?? [])
      )
      .subscribe((routerLinks: ITableValeur[]) => (this.routerLinks = routerLinks));
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pages = this.createFromForm();
    pages.active = this.active;
    if (pages.id !== undefined) {
      this.subscribeToSaveResponse(this.pagesService.update(pages));
    } else {
      this.subscribeToSaveResponse(this.pagesService.create(pages));
    }
  }

  trackModulesById(_index: number, item: IModules): number {
    return item.id!;
  }

  trackActionsById(_index: number, item: IActions): number {
    return item.id!;
  }

  getSelectedActions(option: IActions, selectedVals?: IActions[]): IActions {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  isChecked(event: any): void {
    if (event.target.checked === false) {
      this.active = false;
    }
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPages>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(pages: IPages): void {
    this.editForm.patchValue({
      id: pages.id,
      code: pages.code,
      libelle: pages.libelle,
      description: pages.description,
      modules: pages.modules,
      actions: pages.actions,
      routerLink: pages.routerLink,
      ordre: pages.ordre,
      active: pages.active,
    });
    this.modules = this.modulesService.addModulesToCollectionIfMissing(this.modules, pages.modules);
    this.actionsSharedCollection = this.actionsService.addActionsToCollectionIfMissing(
      this.actionsSharedCollection,
      ...(pages.actions ?? [])
    );
  }

  protected createFromForm(): IPages {
    return {
      ...new Pages(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
      modules: this.editForm.get(['modules'])!.value,
      actions: this.editForm.get(['actions'])!.value,
      routerLink: this.editForm.get(['routerLink'])!.value,
      ordre: this.editForm.get(['ordre'])!.value,
      active: this.editForm.get(['active'])!.value,
    };
  }
  protected loadRelationshipsOptions(): void {
    this.actionsService
      .query()
      .pipe(map((res: HttpResponse<IActions[]>) => res.body ?? []))
      .pipe(
        map((actions: IActions[]) =>
          this.actionsService.addActionsToCollectionIfMissing(actions, ...(this.editForm.get('actions')!.value ?? []))
        )
      )
      .subscribe((actions: IActions[]) => (this.actionsSharedCollection = actions));

    this.modulesService
      .queryActifs()
      .pipe(map((res: HttpResponse<IModules[]>) => res.body ?? []))
      .pipe(
        map((modules: IModules[]) =>
          this.modulesService.addModulesToCollectionIfMissing(modules, ...(this.editForm.get('modules')!.value ?? []))
        )
      )
      .subscribe((modules: IModules[]) => (this.modules = modules));
  }
}
