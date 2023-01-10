import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ITableTypeValeur, TableTypeValeur } from '../table-type-valeur.model';
import { TableTypeValeurService } from '../service/table-type-valeur.service';

@Component({
  selector: 'jhi-table-type-valeur-update',
  templateUrl: './table-type-valeur-update.component.html',
})
export class TableTypeValeurUpdateComponent implements OnInit {
  isSaving = false;
  titre!: string;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    libelle: [null, [Validators.required]],
    description: [],
  });

  constructor(
    protected tableTypeValeurService: TableTypeValeurService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tableTypeValeur }) => {
      this.updateForm(tableTypeValeur);
      if (tableTypeValeur.id !== undefined && tableTypeValeur.id !== null) {
        this.titre = 'Modifier cette Table Type de Valeurs';
      } else {
        this.titre = 'Ajouter une Table Type de Valeurs';
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tableTypeValeur = this.createFromForm();
    if (tableTypeValeur.id !== undefined) {
      this.subscribeToSaveResponse(this.tableTypeValeurService.update(tableTypeValeur));
    } else {
      this.subscribeToSaveResponse(this.tableTypeValeurService.create(tableTypeValeur));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITableTypeValeur>>): void {
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

  protected updateForm(tableTypeValeur: ITableTypeValeur): void {
    this.editForm.patchValue({
      id: tableTypeValeur.id,
      code: tableTypeValeur.code,
      libelle: tableTypeValeur.libelle,
      description: tableTypeValeur.description,
    });
  }

  protected createFromForm(): ITableTypeValeur {
    return {
      ...new TableTypeValeur(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
