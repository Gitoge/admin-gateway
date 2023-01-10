import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IEtablissementBancaire, EtablissementBancaire } from '../etablissement-bancaire.model';
import { EtablissementBancaireService } from '../service/etablissement-bancaire.service';
import { IRoles } from '../../roles/roles.model';

@Component({
  selector: 'jhi-etablissement-bancaire-update',
  templateUrl: './etablissement-bancaire-update.component.html',
})
export class EtablissementBancaireUpdateComponent implements OnInit {
  isSaving = false;
  roles: IRoles[] = [];
  titre?: string;

  etablissementBancaire?: IEtablissementBancaire;
  ngbPaginationPage = 1;
  page?: number;

  typeMessage?: string;
  _success = new Subject<string>();

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern('^[a-zA-Z0-9]*$')]],
    libelle: [],
    telephone: [],
    email: ['', Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
    adresse: [],
    fax: [],
    sigle: [],
    swift: [],
  });

  constructor(
    protected etablissementBancaireService: EtablissementBancaireService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ etablissementBancaire }) => {
      this.etablissementBancaire = etablissementBancaire;

      this.updateForm(etablissementBancaire);
      if (etablissementBancaire?.id !== undefined) {
        this.titre = 'Modifier cet établissement bancaire';
      } else {
        this.titre = 'Ajouter un établissement bancaire';
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const etablissementBancaire = this.createFromForm();
    if (etablissementBancaire.id !== undefined) {
      this.subscribeToSaveResponse(this.etablissementBancaireService.update(etablissementBancaire));
    } else {
      this.subscribeToSaveResponse(this.etablissementBancaireService.create(etablissementBancaire));
    }
  }

  public afficheMessage(msg: string, typeMessage?: string): void {
    this.typeMessage = typeMessage;
    this._success.next(msg);
  }

  protected onSaveSuccessAndShow(successMessage: string): void {
    this.isSaving = false;
    // this.previousState();
    this.onMessageSuccess(successMessage);
    this.previousState();
  }

  protected onMessageSuccess(succesMessage: string): void {
    this.afficheMessage(succesMessage, 'succes');
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEtablissementBancaire>>): void {
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
  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
  protected updateForm(etablissementBancaire: IEtablissementBancaire): void {
    this.editForm.patchValue({
      id: etablissementBancaire.id,
      code: etablissementBancaire.code,
      libelle: etablissementBancaire.libelle,
      telephone: etablissementBancaire.telephone,
      email: etablissementBancaire.email,
      adresse: etablissementBancaire.adresse,
      fax: etablissementBancaire.fax,
      sigle: etablissementBancaire.sigle,
      swift: etablissementBancaire.swift,
    });
  }

  protected createFromForm(): IEtablissementBancaire {
    return {
      ...new EtablissementBancaire(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      telephone: this.editForm.get(['telephone'])!.value,
      email: this.editForm.get(['email'])!.value,
      adresse: this.editForm.get(['adresse'])!.value,
      fax: this.editForm.get(['fax'])!.value,
      sigle: this.editForm.get(['sigle'])!.value,
      swift: this.editForm.get(['swift'])!.value,
    };
  }
}
