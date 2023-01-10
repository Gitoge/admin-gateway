import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAgence, Agence } from '../agence.model';
import { AgenceService } from '../service/agence.service';
import { EtablissementBancaireService } from 'app/entities/etablissement-bancaire/service/etablissement-bancaire.service';
import { IEtablissementBancaire } from 'app/entities/etablissement-bancaire/etablissement-bancaire.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-agence-update',
  templateUrl: './agence-update.component.html',
})
export class AgenceUpdateComponent implements OnInit {
  isSaving = false;

  etablissementBancaireSharedCollection: IEtablissementBancaire[] = [];

  agence!: IAgence;

  constructor(
    protected agenceService: AgenceService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected etablissementBancaireService: EtablissementBancaireService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ agence }) => {
      this.agence = agence;
      //  this.updateForm(agence);
    });

    this.etablissementBancaireService
      .findAll()
      .pipe(map((res: HttpResponse<IEtablissementBancaire[]>) => res.body ?? []))
      .pipe(
        map((etablissementBancaire: IEtablissementBancaire[]) =>
          this.etablissementBancaireService.addEtablissementBancaireToCollectionIfMissing(etablissementBancaire)
        )
      )
      .subscribe((etablissementBancaire: IEtablissementBancaire[]) => (this.etablissementBancaireSharedCollection = etablissementBancaire));
  }

  previousState(): void {
    window.history.back();
  }

  trackEtablissementBancaireById(_index: number, item: IEtablissementBancaire): number {
    return item.id!;
  }

  save(): void {
    this.isSaving = true;
    const agence = this.agence;
    if (agence.id !== undefined) {
      this.subscribeToSaveResponse(this.agenceService.update(agence));
    } else {
      this.subscribeToSaveResponse(this.agenceService.create(agence));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAgence>>): void {
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
}
