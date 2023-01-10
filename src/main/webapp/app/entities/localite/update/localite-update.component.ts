import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ILocalite, Localite } from '../localite.model';
import { LocaliteService } from '../service/localite.service';
import { ITypeLocalite } from 'app/entities/type-localite/type-localite.model';
import { TypeLocaliteService } from 'app/entities/type-localite/service/type-localite.service';
import { StateStorageService } from 'app/core/auth/state-storage.service';

import { ITableValeur } from 'app/entities/table-valeur/table-valeur.model';
import { TableValeurService } from 'app/entities/table-valeur/service/table-valeur.service';

import { AlertService } from 'app/core/util/alert.service';
import Swal from 'sweetalert2';
import { IDepartement } from '../../departement/departement.model';
import { DepartementService } from '../../departement/service/departement.service';
import { IArrondissement } from '../../arrondissement/arrondissement.model';
import { ArrondissementService } from '../../arrondissement/service/arrondissement.service';

@Component({
  selector: 'jhi-localite-update',
  templateUrl: './localite-update.component.html',
})
export class LocaliteUpdateComponent implements OnInit {
  @ViewChild('typeCommune') typeCommune!: ElementRef;
  typeCommuneSelected = '';

  isSaving = false;

  titre!: string;

  localites: ILocalite[] = [];
  localite!: ILocalite;
  localiteRattachements!: ILocalite[];
  pays!: ITableValeur[];
  typeLocalitesSharedCollection: ITypeLocalite[] = [];
  departementsSharedCollection: IDepartement[] = [];
  arrondissementSharedCollection: IArrondissement[] = [];

  typeLocalites!: ITypeLocalite[];

  keys?: string | null = null;

  keysDeux?: string | null = null;

  userInsert: any;

  editForm = this.fb.group({
    id: [],
    code: [],
    estParDefaut: [],
    libelle: [],
    niveau: [],
    ordre: [],
    version: [],
    pays: [],
    insertUserId: [],
    insertDate: [],
    localite: [],
    typeLocalite: [],
    departement: [],
    arrondissement: [],
  });

  constructor(
    protected localiteService: LocaliteService,
    protected typeLocaliteService: TypeLocaliteService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    private stateStorageService: StateStorageService,
    protected tableValeurService: TableValeurService,
    protected departementService: DepartementService,
    protected arrondissementService: ArrondissementService,
    protected jhiAlertService: AlertService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ localite }) => {
      this.localite = localite;
      if (this.localite.typeLocalite) {
        this.getLocaliteRattachement(this.localite.typeLocalite);
      }
      if (localite.id !== undefined && localite.id !== null) {
        this.titre = 'Modifier cette Localite';
      } else {
        this.titre = 'Ajouter une Localite';
      }

      //  this.loadRelationshipsOptions();
    });

    this.localiteService.query().subscribe((res: HttpResponse<ILocalite[]>) => {
      if (res.body !== null) {
        this.localiteRattachements = res.body;
      }
    });

    this.typeLocaliteService.query().subscribe((res: HttpResponse<ITypeLocalite[]>) => {
      if (res.body !== null) {
        this.typeLocalites = res.body;
      }
    });

    this.getPays();
    this.userInsert = this.stateStorageService.getPersonne().id;

    this.departementService
      .queryAll()
      .pipe(map((res: HttpResponse<IDepartement[]>) => res.body ?? []))
      .pipe(
        map((departements: IDepartement[]) =>
          this.departementService.addDepartementToCollectionIfMissing(departements, this.editForm.get('departement')!.value)
        )
      )
      .subscribe((departements: IDepartement[]) => (this.departementsSharedCollection = departements));

    this.arrondissementService
      .queryAll()
      .pipe(map((res: HttpResponse<IArrondissement[]>) => res.body ?? []))
      .pipe(
        map((arrondissement: IArrondissement[]) =>
          this.arrondissementService.addArrondissementToCollectionIfMissing(arrondissement, this.editForm.get('arrondissement')!.value)
        )
      )
      .subscribe((arrondissement: IArrondissement[]) => (this.arrondissementSharedCollection = arrondissement));
  }

  previousState(): void {
    window.history.back();
  }

  onSelected(): void {
    this.typeCommuneSelected = this.typeCommune.nativeElement.value;
  }

  trackLocaliteById(_index: number, item: ILocalite): number {
    return item.id!;
  }

  trackTypeLocaliteById(_index: number, item: ITypeLocalite): number {
    return item.id!;
  }

  getLocaliteRattachement(typeLocalite?: ITypeLocalite | null): void {
    this.localite.typeLocalite = typeLocalite;
    this.localiteRattachements = [];
    switch (typeLocalite?.code) {
      case 'RG': {
        this.localiteService.findLocalitesByType('NT').subscribe((res: HttpResponse<ILocalite[]>) => {
          if (res.body !== null) {
            this.localiteRattachements = res.body;
          }
        });
        break;
        // break;
      }
      case 'DP': {
        this.localiteService.findLocalitesByType('RG').subscribe(
          (res: HttpResponse<ILocalite[]>) => {
            if (res.body !== null) {
              this.localiteRattachements = res.body;
            }
          }
          // (res: HttpErrorResponse) => {}
        );
        break;
      }
      case 'AR': {
        this.localiteService.findLocalitesByType('DP').subscribe(
          (res: HttpResponse<ILocalite[]>) => {
            if (res.body !== null) {
              this.localiteRattachements = res.body;
            }
          }
          // (res: HttpErrorResponse) => {}
        );
        break;
      }

      case 'CM': {
        this.localiteService.findLocalitesByType('DP').subscribe(
          (res: HttpResponse<ILocalite[]>) => {
            if (res.body !== null) {
              this.localiteRattachements = res.body;
            }
          }
          // (res: HttpErrorResponse) => {}
        );
        break;
      }

      case 'VL': {
        this.localiteService.findLocalitesByType('CM').subscribe(
          (res: HttpResponse<ILocalite[]>) => {
            if (res.body !== null) {
              this.localiteRattachements = res.body;
            }
          }
          // (res: HttpErrorResponse) => {}
        );
        break;
      }
      case 'NT': {
        this.localiteService.findLocalitesByType('NT').subscribe(
          (res: HttpResponse<ILocalite[]>) => {
            if (res.body !== null) {
              this.localiteRattachements = res.body;
            }
          }
          // (res: HttpErrorResponse) => {}
        );
        break;
      }
      default: {
        // statements;
        break;
      }
    }
  }

  getLocaliteRattachement2(typeLocalite: any): void {
    this.localite.typeLocalite = typeLocalite;
    this.localiteRattachements = [];
    if (this.localite.typeLocalite) {
      if (this.typeCommuneSelected === 'AR') {
        this.localite.typeLocalite.code = 'CM';
      }
      if (this.typeCommuneSelected === 'DP') {
        this.localite.typeLocalite.code = 'CM';
      }
    }

    switch (typeLocalite.code) {
      case 'RG': {
        this.localiteService.findLocalitesByType('NT').subscribe((res: HttpResponse<ILocalite[]>) => {
          if (res.body !== null) {
            this.localiteRattachements = res.body;
          }
        });
        break;
        // break;
      }
      case 'DP': {
        this.localiteService.findLocalitesByType('DP').subscribe(
          (res: HttpResponse<ILocalite[]>) => {
            if (res.body !== null) {
              this.localiteRattachements = res.body;
            }
          }
          // (res: HttpErrorResponse) => {}
        );
        break;
      }
      case 'AR': {
        this.localiteService.findLocalitesByType('AR').subscribe(
          (res: HttpResponse<ILocalite[]>) => {
            if (res.body !== null) {
              this.localiteRattachements = res.body;
            }
          }
          // (res: HttpErrorResponse) => {}
        );
        break;
      }

      case 'CM': {
        this.localiteService.findLocalitesByType(this.typeCommuneSelected).subscribe(
          (res: HttpResponse<ILocalite[]>) => {
            if (res.body !== null) {
              this.localiteRattachements = res.body;
            }
          }
          // (res: HttpErrorResponse) => {}
        );
        break;
      }

      case 'VL': {
        this.localiteService.findLocalitesByType('CM').subscribe(
          (res: HttpResponse<ILocalite[]>) => {
            if (res.body !== null) {
              this.localiteRattachements = res.body;
            }
          }
          // (res: HttpErrorResponse) => {}
        );
        break;
      }
      case 'NT': {
        this.localiteService.findLocalitesByType('NT').subscribe(
          (res: HttpResponse<ILocalite[]>) => {
            if (res.body !== null) {
              this.localiteRattachements = res.body;
            }
          }
          // (res: HttpErrorResponse) => {}
        );
        break;
      }
      default: {
        // statements;
        break;
      }
    }
  }

  saveLocalite(): void {
    this.isSaving = true;
    this.localite.insertUserId = this.userInsert;
    this.localite.estParDefaut = true;
    if (this.localite.id !== undefined) {
      // UserUpdate Connecté --- MYC
      // this.subscribeToSaveResponse(this.localiteService.update(this.localite));
      this.localiteService.update(this.localite).subscribe(
        (res: HttpResponse<ILocalite>) => {
          this.onSaveSuccess();
        },
        (res: HttpErrorResponse) => {
          this.onSaveError(res);
        }
      );
    } else {
      // UserInsert Connecté --- MYC
      this.localite.insertUserId = this.userInsert;
      // this.subscribeToSaveResponse(this.localiteService.create(this.localite));
      this.localiteService.create(this.localite).subscribe(
        (res: HttpResponse<ILocalite>) => {
          this.onSaveSuccessAndShow('Une nouvelle localite a été crée avec succès');
        },
        (res: HttpErrorResponse) => {
          this.onSaveError(res);
        }
      );
    }
  }

  onKeyUp(event: any): void {
    this.keys = event.target.value;
  }

  onKeyUp2(event: any): void {
    this.keysDeux = event.target.value;
  }

  // protected onMessageSuccess(succesMessage: string) {
  //   this.jhiAlertService.getsuccess(succesMessage, null, null);
  // }

  getPays(): void {
    this.tableValeurService.findPays().subscribe((res: HttpResponse<ITableValeur[]>) => {
      if (res.body !== null) {
        this.pays = res.body;
      }
    });
  }
  trackDepartementById(index: number, item: IDepartement): number {
    return item.id!;
  }
  trackArrondissementById(index: number, item: IArrondissement): number {
    return item.id!;
  }

  protected onSaveSuccessAndShow(successMessage: string): void {
    this.isSaving = false;
    this.previousState();
    // this.onMessageSuccess(successMessage);
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILocalite>>): void {
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

  protected updateForm(localite: ILocalite): void {
    this.editForm.patchValue({
      id: localite.id,
      code: localite.code,
      estParDefaut: localite.estParDefaut,
      libelle: localite.libelle,
      niveau: localite.niveau,
      ordre: localite.ordre,
      version: localite.version,
      pays: localite.pays,
      insertUserId: localite.insertUserId,
      insertDate: localite.insertDate,
      localite: localite.localite,
      typeLocalite: localite.typeLocalite,
    });

    this.localites = this.localiteService.addLocaliteToCollectionIfMissing(this.localites, localite.localite);
    this.typeLocalitesSharedCollection = this.typeLocaliteService.addTypeLocaliteToCollectionIfMissing(
      this.typeLocalitesSharedCollection,
      localite.typeLocalite
    );
    this.departementsSharedCollection = this.departementService.addDepartementToCollectionIfMissing(
      this.departementsSharedCollection,
      localite.departement
    );

    this.arrondissementSharedCollection = this.arrondissementService.addArrondissementToCollectionIfMissing(
      this.arrondissementSharedCollection,
      localite.arrondissement
    );
  }

  protected loadRelationshipsOptions(): void {
    this.localiteService
      .query({ filter: 'rattachementid-is-null' })
      .pipe(map((res: HttpResponse<ILocalite[]>) => res.body ?? []))
      .pipe(
        map((localites: ILocalite[]) =>
          this.localiteService.addLocaliteToCollectionIfMissing(localites, this.editForm.get('localite')!.value)
        )
      )
      .subscribe((localites: ILocalite[]) => (this.localites = localites));

    this.typeLocaliteService
      .query()
      .pipe(map((res: HttpResponse<ITypeLocalite[]>) => res.body ?? []))
      .pipe(
        map((typeLocalites: ITypeLocalite[]) =>
          this.typeLocaliteService.addTypeLocaliteToCollectionIfMissing(typeLocalites, this.editForm.get('typeLocalite')!.value)
        )
      )
      .subscribe((typeLocalites: ITypeLocalite[]) => (this.typeLocalitesSharedCollection = typeLocalites));

    this.departementService
      .query()
      .pipe(map((res: HttpResponse<IDepartement[]>) => res.body ?? []))
      .pipe(
        map((departements: IDepartement[]) =>
          this.departementService.addDepartementToCollectionIfMissing(departements, this.editForm.get('departement')!.value)
        )
      )
      .subscribe((departements: IDepartement[]) => (this.departementsSharedCollection = departements));
  }

  protected createFromForm(): ILocalite {
    return {
      ...new Localite(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      estParDefaut: this.editForm.get(['estParDefaut'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      niveau: this.editForm.get(['niveau'])!.value,
      ordre: this.editForm.get(['ordre'])!.value,
      version: this.editForm.get(['version'])!.value,
      pays: this.editForm.get(['pays'])!.value,
      insertUserId: this.editForm.get(['insertUserId'])!.value,
      insertDate: this.editForm.get(['insertDate'])!.value,
      localite: this.editForm.get(['localite'])!.value,
      typeLocalite: this.editForm.get(['typeLocalite'])!.value,
      departement: this.editForm.get(['departement'])!.value,
    };
  }
}
