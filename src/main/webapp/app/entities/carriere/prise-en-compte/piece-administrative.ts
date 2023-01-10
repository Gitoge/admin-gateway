import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { DocumentAdministratif, IDocumentAdministratif } from '../document-administratif/document-administratif.model';
import { DocumentAdministratifService } from '../document-administratif/service/document-administratif.service';
import { INatureActes } from '../nature-actes/nature-actes.model';
import { NatureActesService } from '../nature-actes/service/nature-actes.service';
import { IEvenement } from '../evenement/evenement.model';
import { EvenementService } from '../evenement/service/evenement.service';
import { ITypeActes } from '../type-actes/type-actes.model';
import { ThisReceiver } from '@angular/compiler';

@Component({
  templateUrl: './piece-administrative.html',
})
export class PieceAdministrativeComponent {
  @Input() idProprietaire?: number;
  @Input() typeEntite?: string;
  @Output() clickevent = new EventEmitter<string>();
  @Output() clickEvent = new EventEmitter<IDocumentAdministratif>();
  @Input() clickEventTypeActes = new EventEmitter<ITypeActes[]>();
  @Output() piece?: IDocumentAdministratif;

  typeActes!: ITypeActes[];

  natureActesSharedCollection: INatureActes[] = [];
  evenementSharedCollection: IEvenement[] = [];

  modalRef?: NgbModalRef;

  isSaving = false;

  editForm = this.fb.group({
    typePiece: [],
    nomPiece: [null, [Validators.required]],
    fichier: [null, [Validators.required]],
    fichierContentType: [null, [Validators.required]],
    numero: [],
    date: [],
    natureActes: [],
    evenement: [],
    matricule: [],
  });

  file?: File;

  constructor(
    protected documentAdministratifService: DocumentAdministratifService,
    protected natureActesService: NatureActesService,
    protected evenementService: EvenementService,
    protected eventManager: EventManager,
    protected dataUtils: DataUtils,
    public activeModal: NgbActiveModal,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    console.error('idProprietaire', this.idProprietaire);
    this.isSaving = false;
    this.loadRelationshipsOptions();
    // console.error("testtesttest", this.typeActes) ;
  }

  save(): void {
    this.isSaving = true;
    const documentAdministratif = this.createFromForm();
    this.subscribeToSaveResponse(this.documentAdministratifService.create(documentAdministratif));
  }
  ajouterDocument(): void {
    console.error('ce qui est envoyé : ', this.createFromForm());
    this.clickEvent.emit(this.createFromForm());
    this.close();
  }

  recevoirEvenement(): ITypeActes[] {
    this.modalRef?.componentInstance.clickEventTypeActes.subscribe((typeActes: ITypeActes) => {
      this.typeActes?.push(typeActes);
    });
    return this.typeActes;
  }

  close(): void {
    this.activeModal.dismiss('Cross click');
    this.activeModal.dismiss('success');
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  incomingfile(event: any): void {
    this.file = event.target.files[0];
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('gestudamgatewayApp.error', { message: err.message })),
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }
  protected loadRelationshipsOptions(): void {
    this.evenementService
      .query()
      .pipe(map((res: HttpResponse<IEvenement[]>) => res.body ?? []))
      .pipe(
        map((evenement: IEvenement[]) =>
          this.evenementService.addEvenementToCollectionIfMissing(evenement, this.editForm.get('evenement')!.value)
        )
      )
      .subscribe((evenement: IEvenement[]) => (this.evenementSharedCollection = evenement));

    this.natureActesService
      .query()
      .pipe(map((res: HttpResponse<INatureActes[]>) => res.body ?? []))
      .pipe(
        map((natureActes: INatureActes[]) =>
          this.natureActesService.addNatureActesToCollectionIfMissing(natureActes, this.editForm.get('natureActes')!.value)
        )
      )
      .subscribe((natureActes: INatureActes[]) => (this.natureActesSharedCollection = natureActes));
  }
  protected createFromForm(): IDocumentAdministratif {
    return {
      ...new DocumentAdministratif(),
      proprietaireId: this.idProprietaire,
      typeEntite: this.typeEntite,
      typeDocument: this.editForm.get(['typePiece'])!.value,
      nomDocument: this.editForm.get(['nomPiece'])!.value,
      fichier: this.editForm.get(['fichier'])!.value,
      fichierContentType: this.editForm.get(['fichierContentType'])!.value,
      numero: this.editForm.get(['numero'])!.value,
      date: this.editForm.get(['date'])!.value,
      natureActe: this.editForm.get(['natureActes'])!.value,
      evenement: this.editForm.get(['evenement'])!.value,
      matricule: this.editForm.get(['matricule'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDocumentAdministratif>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      (res: any) => this.onSaveSuccess(res.body),
      (res: any) => this.onSaveError(res.error.errorKey !== undefined ? res.error.errorKey : null)
    );
  }

  protected onSaveSuccess(ad: IDocumentAdministratif): void {
    this.isSaving = false;
    this.piece = ad;
    this.clickevent.emit('success ajout');

    // console.log('this.piece.id',this.piece.id);
    // alert(this.piece.id);
  }

  protected onSaveError(msgErreur: string): void {
    // Api for inheritance.
    this.clickevent.emit('echec ajout');
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
    this.close();
  }
}
