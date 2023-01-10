import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IRoles, Roles } from '../roles.model';
import { RolesService } from '../service/roles.service';
import { IProfils } from 'app/entities/profils/profils.model';
import { ProfilsService } from 'app/entities/profils/service/profils.service';
import { IPagesActions } from 'app/shared/model/pagesActions';
import { IPagesActionsCustom } from 'app/shared/model/pagesActionsCustom';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';

@Component({
  selector: 'jhi-roles-update',
  templateUrl: './roles-update.component.html',
})
export class RolesUpdateComponent implements OnInit {
  isSaving = false;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  titre!: string;

  pagesActionsSharedCollection: IPagesActionsCustom[] = [];

  editForm = this.fb.group({
    id: [],
    code: [],
    libelle: [],
    description: [],
    pagesActions: [],
  });

  pagesActionsChoisies: IPagesActions[] = [];
  allItemsSelected = false;
  // nbre: number = 0;

  constructor(
    protected rolesService: RolesService,
    protected profilsService: ProfilsService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  verifPagesActions(idPageAction: number): boolean {
    if (typeof this.pagesActionsSharedCollection !== 'undefined' && this.pagesActionsSharedCollection !== null) {
      for (const pageAction of this.pagesActionsSharedCollection) {
        if (pageAction.id === idPageAction) {
          return true;
        }
      }
    }
    return false;
  }

  add(event: any, pageAction: IPagesActions): void {
    if (event.target.checked === true) {
      pageAction.isChecked = true;
      this.pagesActionsChoisies.push(pageAction);
    } else {
      this.allItemsSelected = false;
      for (let i = 0; i < this.pagesActionsChoisies.length; i++) {
        if (this.pagesActionsChoisies[i].id === pageAction.id) {
          pageAction.isChecked = false;
          this.pagesActionsChoisies.splice(i, 1);
          break;
        }
      }
    }
    // console.log(this.actionsChoisies.length);
    /* if (this.pagesActionsChoisies.length > 0) {
        this.nbre = '' + this.pagesActionsChoisies.length;
    } else {
        this.nbre = '';
    } */
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ roles }) => {
      this.updateForm(roles);
      if (roles.id !== undefined && roles.id !== null) {
        this.titre = 'Modifier ce Rôle';
      } else {
        this.titre = 'Ajouter un Rôle';
      }
      // this.loadRelationshipsOptions();
      this.handleNavigation();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const roles = this.createFromForm();
    if (roles.id !== undefined) {
      this.subscribeToSaveResponse(this.rolesService.update(roles));
    } else {
      this.subscribeToSaveResponse(this.rolesService.create(roles));
    }
  }

  trackPagesActionsById(_index: number, item: IPagesActions): number {
    return item.id!;
  }

  getSelectedPagesActions(option: IPagesActions, selectedVals?: IPagesActions[]): IPagesActions {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          option.isChecked = true;
          return selectedVal;
        }
      }
    }
    return option;
  }

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.rolesService
      .queryPagesActions({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<IPagesActions[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        error: () => {
          this.isLoading = false;
          this.onError();
        },
      });
  }

  protected onSuccess(data: IPagesActions[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      /* this.router.navigate(['/roles'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      }); */
    }
    this.pagesActionsSharedCollection = data ?? [];
    for (const pageAction of this.pagesActionsSharedCollection) {
      for (const pagesActionsChoisie of this.pagesActionsChoisies) {
        if (pagesActionsChoisie.id === pageAction.id) {
          pageAction.isChecked = true;
        }
      }
    }
    // alert(this.pagesActionsChoisies.length);
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? ASC : DESC)];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      /* const page = params.get('page');
      const pageNumber = +(page ?? 1);
      const sort = (params.get(SORT) ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === ASC; */
      const page = params.get('page');
      const pageNumber = +(page ?? 1);
      const predicate = 'id';
      const ascending = true;
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
      }
    });
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRoles>>): void {
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

  protected updateForm(roles: IRoles): void {
    this.editForm.patchValue({
      id: roles.id,
      code: roles.code,
      libelle: roles.libelle,
      description: roles.description,
      pagesActions: roles.pagesActions,
    });
    if (roles.pagesActions) {
      this.pagesActionsChoisies = roles.pagesActions;
    }

    this.pagesActionsSharedCollection = this.rolesService.addPagesActionsToCollectionIfMissing(
      this.pagesActionsSharedCollection,
      ...(roles.pagesActions ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.rolesService
      .queryPagesActions()
      .pipe(map((res: HttpResponse<IPagesActionsCustom[]>) => res.body ?? []))
      .pipe(
        map((pagesActions: IPagesActionsCustom[]) =>
          this.rolesService.addPagesActionsToCollectionIfMissing(pagesActions, ...(this.editForm.get('pagesActions')!.value ?? []))
        )
      )
      .subscribe((pagesActions: IPagesActions[]) => (this.pagesActionsSharedCollection = pagesActions));
  }

  protected createFromForm(): IRoles {
    return {
      ...new Roles(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
      //pagesActions: this.editForm.get(['pagesActions'])!.value,
      pagesActions: this.pagesActionsChoisies,
    };
  }
}
