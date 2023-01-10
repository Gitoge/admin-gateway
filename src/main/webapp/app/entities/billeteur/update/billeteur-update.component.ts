import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBilleteur, Billeteur } from '../billeteur.model';
import { BilleteurService } from '../service/billeteur.service';
import { IEtablissement } from '../../etablissement/etablissement.model';
import { EtablissementService } from '../../etablissement/service/etablissement.service';
import Swal from 'sweetalert2';
import { AgentService } from '../../carriere/agent/service/agent.service';

@Component({
  selector: 'jhi-billeteur-update',
  templateUrl: './billeteur-update.component.html',
})
export class BilleteurUpdateComponent implements OnInit {
  isSaving = false;
  etablissementSharedCollection: IEtablissement[] = [];
  etab: any;

  editForm = this.fb.group({
    id: [],
    etablissement: [],
    code: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9]*$')]],
    prenom: [],
    nom: [],
    matricule: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(7)]],
    telephone: [null, [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
  });

  constructor(
    protected billeteurService: BilleteurService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected etablissementService: EtablissementService,
    protected agentService: AgentService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ billeteur }) => {
      this.updateForm(billeteur);
      this.loadRelationshipsOptions();
      if (billeteur.id !== undefined) {
        //
      }
    });
  }

  previousState(): void {
    window.history.back();
  }
  getInfosByMatricule(matricule: string): any {
    this.agentService.findAgentByMatricule(matricule).subscribe((result: any) => {
      console.error('infos ', result.body[0]);
      if (result.body[0].prenom === undefined) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur...',
          text: 'Matricule introuvable',
        });
      }
      this.editForm.patchValue({
        prenom: result.body[0].prenom,
        nom: result.body[0].nom,
      });
    });
  }
  save(): void {
    this.isSaving = true;
    const billeteur = this.createFromForm();
    if (billeteur.id !== undefined) {
      this.subscribeToSaveResponse(this.billeteurService.update(billeteur));
    } else {
      this.subscribeToSaveResponse(this.billeteurService.create(billeteur));
    }
  }
  protected loadRelationshipsOptions(): void {
    this.etablissementService
      .findAll()
      .pipe(map((res: HttpResponse<IEtablissement[]>) => res.body ?? []))
      .pipe(
        map((etablissement: IEtablissement[]) =>
          this.etablissementService.addEtablissementToCollectionIfMissing(etablissement, this.editForm.get('etablissement')!.value)
        )
      )
      .subscribe((etablissement: IEtablissement[]) => (this.etablissementSharedCollection = etablissement));
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBilleteur>>): void {
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

  protected updateForm(billeteur: IBilleteur): void {
    this.editForm.patchValue({
      id: billeteur.id,
      etablissement: billeteur.etablissement,
      code: billeteur.code,
      prenom: billeteur.prenom,
      nom: billeteur.nom,
      matricule: billeteur.matricule,
      telephone: billeteur.telephone,
    });
  }

  protected createFromForm(): IBilleteur {
    return {
      ...new Billeteur(),
      id: this.editForm.get(['id'])!.value,
      etablissement: this.editForm.get(['etablissement'])!.value,
      code: this.editForm.get(['code'])!.value,
      prenom: this.editForm.get(['prenom'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      matricule: this.editForm.get(['matricule'])!.value,
      telephone: this.editForm.get(['telephone'])!.value,
    };
  }
}
