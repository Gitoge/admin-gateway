import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, finalize, map } from 'rxjs/operators';

import { ITableValeur, TableValeur } from '../table-valeur.model';
import { TableValeurService } from '../service/table-valeur.service';
import { ITableTypeValeur } from 'app/entities/table-type-valeur/table-type-valeur.model';
import { TableTypeValeurService } from 'app/entities/table-type-valeur/service/table-type-valeur.service';
import { Alert, AlertService } from 'app/core/util/alert.service';

@Component({
  selector: 'jhi-table-valeur-update',
  templateUrl: './table-valeur-update.component.html',
})
export class TableValeurUpdateComponent implements OnInit {
  isSaving = false;
  titre!: string;

  tableTypeValeursSharedCollection: ITableTypeValeur[] = [];

  tableTypeValeurs?: ITableTypeValeur[];

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    libelle: [null, [Validators.required]],
    description: [],
    tabletypevaleur: [],
  });

  constructor(
    protected tableValeurService: TableValeurService,
    protected tableTypeValeurService: TableTypeValeurService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected jhiAlertService: AlertService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tableValeur }) => {
      this.updateForm(tableValeur);
      if (tableValeur.id !== undefined && tableValeur.id !== null) {
        this.titre = 'Modifier cette Table de Valeurs';
      } else {
        this.titre = 'Ajouter une Table de Valeurs';
      }

      this.loadRelationshipsOptions();
    });

    // this.tableTypeValeurService
    //         .getListTableTypeValeur()
    //         .pipe(
    //             filter((mayBeOk: HttpResponse<ITableTypeValeur[]>) => mayBeOk.ok),
    //             map((response: HttpResponse<ITableTypeValeur[]>) => response.body)
    //         )
    //         .subscribe({
    //           next: () => this.onSaveSuccess(),
    //           error: () => this.onSaveError(),
    //         }

    //         );
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tableValeur = this.createFromForm();
    if (tableValeur.id !== undefined) {
      this.subscribeToSaveResponse(this.tableValeurService.update(tableValeur));
    } else {
      this.subscribeToSaveResponse(this.tableValeurService.create(tableValeur));
    }
  }

  trackTableTypeValeurById(_index: number, item: ITableTypeValeur): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITableValeur>>): void {
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

  protected updateForm(tableValeur: ITableValeur): void {
    this.editForm.patchValue({
      id: tableValeur.id,
      code: tableValeur.code,
      libelle: tableValeur.libelle,
      description: tableValeur.description,
      tabletypevaleur: tableValeur.tabletypevaleur,
    });

    this.tableTypeValeursSharedCollection = this.tableTypeValeurService.addTableTypeValeurToCollectionIfMissing(
      this.tableTypeValeursSharedCollection,
      tableValeur.tabletypevaleur
    );
  }

  protected loadRelationshipsOptions(): void {
    this.tableTypeValeurService
      .getListTableTypeValeur()
      .pipe(map((res: HttpResponse<ITableTypeValeur[]>) => res.body ?? []))
      .pipe(
        map((tableTypeValeurs: ITableTypeValeur[]) =>
          this.tableTypeValeurService.addTableTypeValeurToCollectionIfMissing(tableTypeValeurs, this.editForm.get('tabletypevaleur')!.value)
        )
      )
      .subscribe((tableTypeValeurs: ITableTypeValeur[]) => (this.tableTypeValeursSharedCollection = tableTypeValeurs));
  }

  protected createFromForm(): ITableValeur {
    return {
      ...new TableValeur(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
      tabletypevaleur: this.editForm.get(['tabletypevaleur'])!.value,
    };
  }
}
