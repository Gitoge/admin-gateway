import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IService, Service } from '../service.model';
import { ServiceService } from '../service/service.service';
import { IDirection } from 'app/entities/direction/direction.model';
import { DirectionService } from 'app/entities/direction/service/direction.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-service-update',
  templateUrl: './service-update.component.html',
})
export class ServiceUpdateComponent implements OnInit {
  isSaving = false;

  titre!: string;
  service!: IService;
  typeMessage?: string;
  _success = new Subject<string>();

  directionsSharedCollection: IDirection[] = [];

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    libelle: [null, [Validators.required]],
    adresse: [],
    numTelephone: [],
    fax: [],
    email: [],
    contact: [],
    direction: [],
  });

  constructor(
    protected serviceService: ServiceService,
    protected directionService: DirectionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ service }) => {
      this.updateForm(service);

      if (service.id !== undefined && service.id !== null) {
        this.titre = 'Modifier ce Service';
      } else {
        this.titre = 'Ajouter un Service';
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const service = this.createFromForm();
    if (service.id !== undefined) {
      this.subscribeToSaveResponse(this.serviceService.update(service));
    } else {
      this.subscribeToSaveResponse(this.serviceService.create(service));
    }
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

  trackDirectionById(_index: number, item: IDirection): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IService>>): void {
    result.subscribe(
      (res: HttpResponse<IDirection>) => this.onSaveSuccess(res.body),
      error => this.onSaveError(error)
    );
  }

  protected onSaveSuccess(service: IService | null): void {
    if (service !== null) {
      this.service = service;

      this.isSaving = false;
      /* (async () => {
        // Do something before delay
        this.afficheMessage('Opération effectuée avec succès.', 'success');

        await this.delay(3000);

        this.refresh();

        // Do something after
      })();*/

      if (this.service.id !== undefined) {
        Swal.fire(
          `<h4 style="font-family: Helvetica; font-size:16px">Service <b>${service?.libelle ?? ''}</b> enregistré avec succès</h4>`
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

  protected updateForm(service: IService): void {
    this.editForm.patchValue({
      id: service.id,
      code: service.code,
      libelle: service.libelle,
      adresse: service.adresse,
      numTelephone: service.numTelephone,
      fax: service.fax,
      email: service.email,
      contact: service.contact,
      direction: service.direction,
    });

    this.directionsSharedCollection = this.directionService.addDirectionToCollectionIfMissing(
      this.directionsSharedCollection,
      service.direction
    );
  }

  protected loadRelationshipsOptions(): void {
    this.directionService
      .findAll()
      .pipe(map((res: HttpResponse<IDirection[]>) => res.body ?? []))
      .pipe(
        map((directions: IDirection[]) =>
          this.directionService.addDirectionToCollectionIfMissing(directions, this.editForm.get('direction')!.value)
        )
      )
      .subscribe((directions: IDirection[]) => (this.directionsSharedCollection = directions));
  }

  protected createFromForm(): IService {
    return {
      ...new Service(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      adresse: this.editForm.get(['adresse'])!.value,
      numTelephone: this.editForm.get(['numTelephone'])!.value,
      fax: this.editForm.get(['fax'])!.value,
      email: this.editForm.get(['email'])!.value,
      contact: this.editForm.get(['contact'])!.value,
      direction: this.editForm.get(['direction'])!.value,
    };
  }
}
