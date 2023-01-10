import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IDocumentAdministratif, DocumentAdministratif } from '../document-administratif.model';
import { DocumentAdministratifService } from '../service/document-administratif.service';

@Component({
  selector: 'jhi-document-administratif-update',
  templateUrl: './document-administratif-update.component.html',
})
export class DocumentAdministratifUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    dateCreation: [],
    proprietaireId: [null, [Validators.required]],
    nomDocument: [null, [Validators.required]],
    typeEntite: [],
    typeDocument: [],
    employe: [],
  });

  constructor(
    protected documentAdministratifService: DocumentAdministratifService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ documentAdministratif }) => {
      if (documentAdministratif.id === undefined) {
        //const today = dayjs().startOf('day');
        //documentAdministratif.dateCreation = today;
      }

      this.updateForm(documentAdministratif);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const documentAdministratif = this.createFromForm();
    if (documentAdministratif.id !== undefined) {
      this.subscribeToSaveResponse(this.documentAdministratifService.update(documentAdministratif));
    } else {
      this.subscribeToSaveResponse(this.documentAdministratifService.create(documentAdministratif));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDocumentAdministratif>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
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

  protected updateForm(documentAdministratif: IDocumentAdministratif): void {
    this.editForm.patchValue({
      id: documentAdministratif.id,
      dateCreation: documentAdministratif.dateCreation ? documentAdministratif.dateCreation.format(DATE_TIME_FORMAT) : null,
      proprietaireId: documentAdministratif.proprietaireId,
      nomDocument: documentAdministratif.nomDocument,
      typeEntite: documentAdministratif.typeEntite,
      typeDocument: documentAdministratif.typeDocument,
    });
  }

  protected createFromForm(): IDocumentAdministratif {
    return {
      ...new DocumentAdministratif(),
      id: this.editForm.get(['id'])!.value,
      dateCreation: this.editForm.get(['dateCreation'])!.value,
      proprietaireId: this.editForm.get(['proprietaireId'])!.value,
      nomDocument: this.editForm.get(['nomDocument'])!.value,
      typeEntite: this.editForm.get(['typeEntite'])!.value,
      typeDocument: this.editForm.get(['typeDocument'])!.value,
    };
  }
}
