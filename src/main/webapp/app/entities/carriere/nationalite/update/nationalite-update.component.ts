import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { finalize, debounceTime } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { INationalite, Nationalite } from '../nationalite.model';
import { NationaliteService } from '../service/nationalite.service';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { NgbAlert, NgbNav, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-nationalite-update',
  templateUrl: './nationalite-update.component.html',
  styleUrls: ['../prise-en-compte.scss'],
})
export class NationaliteUpdateComponent implements OnInit {
  isSaving = false;
  titre!: string;

  userInsert: any;
  changeText!: boolean;

  nationalite!: INationalite;

  // ----------------------------------------

  success: any;

  firstPagin = 0;

  typeMessage?: string;
  _success = new Subject<string>();

  staticAlertClosed = false;
  successMessage = '';

  active: any;

  @ViewChild('staticAlert', { static: false }) staticAlert?: NgbAlert;
  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert?: NgbAlert;

  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  page1!: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  ngbPaginationPage2 = 1;
  title!: string;
  // -------------------------

  editForm = this.fb.group({
    id: [],
    code: [],
    libelle: [null, [Validators.required]],
    userInsertId: [],
    userUpdateId: [],
    dateInsert: [],
    dateUpdate: [],
  });

  constructor(
    protected nationaliteService: NationaliteService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    private stateStorageService: StateStorageService
  ) {}

  initMessage(): void {
    this._success.subscribe(message => (this.successMessage = message));
    this._success.pipe(debounceTime(1000)).subscribe(() => {
      if (this.selfClosingAlert) {
        this.selfClosingAlert.close();
      }
    });
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ nationalite }) => {
      this.nationalite = nationalite;

      if (nationalite.id === undefined) {
        const today = dayjs().startOf('day');
        nationalite.dateInsert = today;
        nationalite.dateUpdate = today;
      }

      this.updateForm(nationalite);

      if (nationalite.id !== undefined && nationalite.id !== null) {
        this.titre = 'Modifier le nom de cette Nationalité: ';
        //this.titre = 'Modifier le nom de cette application: ' [applications.nom];
      } else {
        this.titre = 'Ajouter une Nationalité';
      }
    });
    this.userInsert = this.stateStorageService.getDataUser().id;
    this.changeText = false;
  }

  previousState(): void {
    window.history.back();
  }

  changePageSuivante(tab: NgbNav): void {
    tab.select('infos-priseEnCompte');
  }

  onNavChange(changeEvent: NgbNavChangeEvent): void {
    if (changeEvent.nextId === 3) {
      changeEvent.preventDefault();
    }
  }

  save(): void {
    this.isSaving = true;
    const nationalite = this.createFromForm();
    if (nationalite.id !== undefined) {
      nationalite.userUpdateId = this.userInsert;
      this.subscribeToSaveResponse(this.nationaliteService.update(nationalite));
    } else {
      nationalite.userInsertId = this.userInsert;
      this.subscribeToSaveResponse(this.nationaliteService.create(nationalite));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INationalite>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: error => this.onSaveError(error),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(err: any): void {
    Swal.fire({
      icon: 'error',
      title: 'Erreur...',
      text: err.error.message,
    });
    // console.error(err.error.message);
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(nationalite: INationalite): void {
    this.editForm.patchValue({
      id: nationalite.id,
      code: nationalite.code,
      libelle: nationalite.libelle,
      userInsertId: nationalite.userInsertId,
      userUpdateId: nationalite.userUpdateId,
      dateInsert: nationalite.dateInsert ? nationalite.dateInsert.format(DATE_TIME_FORMAT) : null,
      dateUpdate: nationalite.dateUpdate ? nationalite.dateUpdate.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): INationalite {
    return {
      ...new Nationalite(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      userInsertId: this.editForm.get(['userInsertId'])!.value,
      userUpdateId: this.editForm.get(['userUpdateId'])!.value,
      dateInsert: this.editForm.get(['dateInsert'])!.value ? dayjs(this.editForm.get(['dateInsert'])!.value, DATE_TIME_FORMAT) : undefined,
      dateUpdate: this.editForm.get(['dateUpdate'])!.value ? dayjs(this.editForm.get(['dateUpdate'])!.value, DATE_TIME_FORMAT) : undefined,
    };
  }
}
