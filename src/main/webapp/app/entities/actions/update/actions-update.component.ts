import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IActions, Actions } from '../actions.model';
import { ActionsService } from '../service/actions.service';
import { IPages } from 'app/entities/pages/pages.model';
import { PagesService } from 'app/entities/pages/service/pages.service';

@Component({
  selector: 'jhi-actions-update',
  templateUrl: './actions-update.component.html',
})
export class ActionsUpdateComponent implements OnInit {
  isSaving = false;

  titre!: string;

  pagesSharedCollection: IPages[] = [];

  editForm = this.fb.group({
    id: [],
    code: [],
    libelle: [],
    description: [],
    actionLink: [],
    pages: [],
  });

  constructor(
    protected actionsService: ActionsService,
    protected pagesService: PagesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ actions }) => {
      this.updateForm(actions);

      if (actions.id !== undefined && actions.id !== null) {
        this.titre = 'Modifier cette Action';
      } else {
        this.titre = 'Ajouter une Action';
      }
      // this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const actions = this.createFromForm();
    if (actions.id !== undefined) {
      this.subscribeToSaveResponse(this.actionsService.update(actions));
    } else {
      this.subscribeToSaveResponse(this.actionsService.create(actions));
    }
  }

  trackPagesById(_index: number, item: IPages): number {
    return item.id!;
  }

  getSelectedPages(option: IPages, selectedVals?: IPages[]): IPages {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActions>>): void {
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

  protected updateForm(actions: IActions): void {
    this.editForm.patchValue({
      id: actions.id,
      code: actions.code,
      libelle: actions.libelle,
      description: actions.description,
      actionLink: actions.actionLink,
    });

    // this.pagesSharedCollection = this.actionsService.addActionsToCollectionIfMissing(this.pagesSharedCollection, ...(actions.pages ?? []));
  }

  /* protected loadRelationshipsOptions(): void {
    this.pagesService
      .query()
      .pipe(map((res: HttpResponse<IPages[]>) => res.body ?? []))
      .pipe(map((pages: IPages[]) => this.pagesService.addPagesToCollectionIfMissing(pages, ...(this.editForm.get('pages')!.value ?? []))))
      .subscribe((pages: IPages[]) => (this.pagesSharedCollection = pages));
  } */

  protected createFromForm(): IActions {
    return {
      ...new Actions(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
      actionLink: this.editForm.get(['actionLink'])!.value,
    };
  }
}
