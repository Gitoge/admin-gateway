import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IDirection, Direction } from '../direction.model';
import { DirectionService } from '../service/direction.service';
import { IEtablissement } from 'app/entities/etablissement/etablissement.model';
import { EtablissementService } from 'app/entities/etablissement/service/etablissement.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-direction-update',
  templateUrl: './direction-update.component.html',
})
export class DirectionUpdateComponent implements OnInit {
  isSaving = false;
  titre!: string;
  direction!: IDirection;
  typeMessage?: string;
  _success = new Subject<string>();

  etablissementsSharedCollection: IEtablissement[] = [];
  code?: any;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9]*$')]],
    libelle: [null, [Validators.required]],
    adresse: [],
    numTelephone: [],
    fax: [],
    email: [],
    contact: [],
    etab: [],
  });

  constructor(
    protected directionService: DirectionService,
    protected etablissementService: EtablissementService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ direction }) => {
      this.updateForm(direction);
      if (direction.id !== undefined && direction.id !== null) {
        this.titre = 'Modifier cette Direction';
      } else {
        this.titre = 'Ajouter une Direction';
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const direction = this.createFromForm();
    if (direction.id !== undefined) {
      this.subscribeToSaveResponse(this.directionService.update(direction));
    } else {
      this.subscribeToSaveResponse(this.directionService.create(direction));
    }
  }
  genererCode(code: string): void {
    this.code = code;
    this.editForm.patchValue({
      code: this.editForm.get('etab')!.value?.code,
    });
  }
  trackEtablissementById(_index: number, item: IEtablissement): number {
    return item.id!;
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDirection>>): void {
    result.subscribe(
      (res: HttpResponse<IDirection>) => this.onSaveSuccess(res.body),
      error => this.onSaveError(error)
    );
  }

  protected onSaveSuccess(direction: IDirection | null): void {
    if (direction !== null) {
      this.direction = direction;

      this.isSaving = false;

      if (this.direction.id !== undefined) {
        Swal.fire(
          `<h4 style="font-family: Helvetica; font-size:16px">Direction <b>${direction?.libelle ?? ''}</b> enregistré avec succès</h4>`
        );
      }

      this.previousState();
    }
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

  protected updateForm(direction: IDirection): void {
    this.editForm.patchValue({
      id: direction.id,
      code: direction.code,
      libelle: direction.libelle,
      adresse: direction.adresse,
      numTelephone: direction.numTelephone,
      fax: direction.fax,
      email: direction.email,
      contact: direction.contact,
      etab: direction.etab,
    });

    this.etablissementsSharedCollection = this.etablissementService.addEtablissementToCollectionIfMissing(
      this.etablissementsSharedCollection,
      direction.etab
    );
  }

  protected loadRelationshipsOptions(): void {
    this.etablissementService
      .findAll()
      .pipe(map((res: HttpResponse<IEtablissement[]>) => res.body ?? []))
      .pipe(
        map((etablissements: IEtablissement[]) =>
          this.etablissementService.addEtablissementToCollectionIfMissing(etablissements, this.editForm.get('etab')!.value)
        )
      )
      .subscribe((etablissements: IEtablissement[]) => (this.etablissementsSharedCollection = etablissements));
  }

  protected createFromForm(): IDirection {
    return {
      ...new Direction(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      adresse: this.editForm.get(['adresse'])!.value,
      numTelephone: this.editForm.get(['numTelephone'])!.value,
      fax: this.editForm.get(['fax'])!.value,
      email: this.editForm.get(['email'])!.value,
      contact: this.editForm.get(['contact'])!.value,
      etab: this.editForm.get(['etab'])!.value,
    };
  }
}
