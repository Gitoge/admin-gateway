import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IAgent } from 'app/entities/carriere/agent/agent.model';
import { ISituationAdministrative } from 'app/entities/carriere/situation-administrative/situation-administrative.model';
import { IPostes } from 'app/entities/postes/postes.model';
import { PostesService } from 'app/entities/postes/service/postes.service';
import dayjs from 'dayjs';
import { finalize, map, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { IBaremeCalculHeuresSupp } from '../../bareme-calcul-heures-supp/bareme-calcul-heures-supp.model';

import { ISaisieElementsVariables } from '../saisie-elements-variables.model';
import { HeuresSupp, IHeuresSupp } from './heures-supp.model';

@Component({
  selector: 'jhi-heures-supp',
  templateUrl: './heures_supp.component.html',
})
export class HeuresSuppComponent implements OnInit {
  isSaving = false;

  @Output() clickEvent = new EventEmitter<IHeuresSupp>();
  agent!: IAgent;
  situationAdminisrtativeAgent!: ISituationAdministrative;

  modalRef?: NgbModalRef;

  today: any;
  postesSharedCollection: IPostes[] = [];
  poste!: IPostes;
  codeposte: any;
  keyword = 'code';

  heuresSupp: IHeuresSupp | undefined;

  baremeCalculHeurSupp!: IBaremeCalculHeuresSupp;

  elemntsVariablesSaisie: ISaisieElementsVariables | undefined;

  editForm = this.fb.group({
    id: [],
    codePoste: [],
    libellePoste: [],
    heuresOrdinaires: [],
    dimanchesJoursFeries: [],
    heuresNuit: [],
    postes: [],
  });
  posteId: any;
  libellePoste: any;
  sens: any;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected activeModal: NgbActiveModal,
    protected postesService: PostesService
  ) {}

  ngOnInit(): void {
    this.today = dayjs().startOf('day');
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ heuresSupp }) => {
      this.heuresSupp = heuresSupp;
      if (this.heuresSupp) {
        this.heuresSupp.heuresOrdinaires = 0;
        this.heuresSupp.dimanchesJoursFeries = 0;
        this.heuresSupp.heuresNuit = 0;
      }
    });
    this.loadRelationshipsOptions();
  }

  previousState(): void {
    window.history.back();
  }

  cancel(): void {
    this.activeModal.dismiss('Cross click');
    this.activeModal.dismiss('success');
  }

  ajouterHeuresSupp(): void {
    this.heuresSupp = this.createFromForm();
    this.heuresSupp.codePoste = this.codeposte;
    this.clickEvent.emit(this.createFromForm());
    this.cancel();
  }

  selectEvent(item: any): any {
    this.posteId = item.id;
    this.libellePoste = item.libelle;
    this.codeposte = item.code;
    this.sens = item.sens;
    this.getPostesByCode(this.codeposte);
  }
  getPostesByCode(code: string | undefined): void {
    if (code) {
      this.postesService.findByCode(code).subscribe(
        (result: any) => {
          this.poste = result.body;
          this.posteId = this.poste?.id;
          this.codeposte = result.body.code;
          this.sens = result.body.sens;
          this.libellePoste = this.poste?.libelle;
          this.editForm.patchValue({
            codeposte: result.body,
            libellePoste: this.poste?.libelle,
          });
        },
        (res: HttpErrorResponse) => {
          this.onError();
          this.editForm.patchValue({
            codeposte: null,
            libellePoste: null,
          });
        }
      );
    }
  }
  onChangeSearch(search: string): void {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e: any): void {
    // console.error('test');
  }
  onFocusOutEvent(item: any): void {
    if (item.target.value !== null && item.target.value !== undefined && item.target.value !== '') {
      this.getPostesByCode(item.target.value);
    }
  }
  protected onError(): void {
    Swal.fire({
      icon: 'error',
      title: 'Erreur...',
      text: 'Ce code n existe pas!',
    });
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHeuresSupp>>): void {
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

  protected updateForm(heuresSupp: IHeuresSupp): void {
    this.editForm.patchValue({
      id: heuresSupp.id,
      codePoste: heuresSupp.codePoste,
      libellePoste: heuresSupp.libellePoste,
      heuresOrdinaires: heuresSupp.heuresOrdinaires,
      dimanchesJoursFeries: heuresSupp.dimanchesJoursFeries,
      heuresNuit: heuresSupp.heuresNuit,
    });
  }

  protected loadRelationshipsOptions(): void {
    this.postesService
      .findAll()
      .pipe(map((res: HttpResponse<IPostes[]>) => res.body ?? []))
      .pipe(map((postes: IPostes[]) => this.postesService.addPostesToCollectionIfMissing(postes, this.editForm.get('postes')!.value)))
      .subscribe((postes: IPostes[]) => (this.postesSharedCollection = postes));
  }

  protected createFromForm(): IHeuresSupp {
    return {
      ...new HeuresSupp(),
      id: this.editForm.get(['id'])!.value,
      codePoste: this.editForm.get(['codePoste'])!.value,
      libellePoste: this.editForm.get(['libellePoste'])!.value,
      heuresOrdinaires: this.editForm.get(['heuresOrdinaires'])!.value,
      dimanchesJoursFeries: this.editForm.get(['dimanchesJoursFeries'])!.value,
      heuresNuit: this.editForm.get(['heuresNuit'])!.value,
    };
  }
}
