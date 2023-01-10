import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, finalize, map } from 'rxjs/operators';

import { IPersonne, Personne } from '../personne.model';
import { PersonneService } from '../service/personne.service';
import { RegisterService } from '../../../account/register/register.service';
import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from '../../../config/error.constants';
import { IProfils } from 'app/entities/profils/profils.model';
import { ProfilsService } from 'app/entities/profils/service/profils.service';
import { ILocalite } from '../../localite/localite.model';
import { ITypeLocalite } from '../../type-localite/type-localite.model';
import { LocaliteService } from '../../localite/service/localite.service';
import { TypeLocaliteService } from '../../type-localite/service/type-localite.service';
import { UserInfos } from '../../../shared/model/userInfos';
import { IEtablissement } from '../../etablissement/etablissement.model';
import { EtablissementService } from '../../etablissement/service/etablissement.service';
import { StateStorageService } from '../../../core/auth/state-storage.service';
import { NgbCalendar, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { IRoles } from '../../roles/roles.model';
import { RolesService } from '../../roles/service/roles.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-personne-update',
  templateUrl: './personne-update.component.html',
})
export class PersonneUpdateComponent implements OnInit {
  [x: string]: any;
  isPasseport!: boolean;

  isSaving = false;
  titre?: string;
  keys2?: string = '';
  keys1?: string = '';
  motDePasse = 'passer';
  profils: IProfils[] = [];
  etablissement: IEtablissement[] = [];
  roles: IRoles[] = [];

  personne?: IPersonne;
  regions?: ILocalite[];
  departement?: ILocalite[];

  idEtablissement?: any;

  // Localité et type Localité
  commune?: ILocalite[];
  region?: ILocalite[];
  localiteId?: any;
  localitesCommune?: ILocalite[];
  champInterventions?: ITypeLocalite[];

  @ViewChild('login', { static: false })
  login?: ElementRef;
  email?: ElementRef;
  error = false;
  errorEmailExists = false;
  errorUserExists = false;
  success = false;
  doNotMatch = false;

  keyword = 'libelleLong';
  public etablissements: any;

  editForm = this.fb.group({
    id: [],
    login: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$'),
      ],
    ],
    email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.email]],
    password: this.motDePasse,
    confirmPassword: this.motDePasse,
    prenom: [],
    nom: [],
    dateNaissance: [],
    lieuNaissance: [],
    telephone: [],
    typePiece: [],
    numeroPiece: [null, [Validators.minLength(13), Validators.maxLength(14), Validators.pattern('^[a-zA-Z0-9]*$')]],
    numeroPasseport: [null, [Validators.minLength(9), Validators.maxLength(9), Validators.pattern('^[a-zA-Z0-9]*$')]],
    profils: [],
    sexe: [],
    champIntervention: [],
    region: [],
    departement: [],
    commune: [],
    etablissement: [],
    jhiUserId: [],
    dateDerniereConnexion: [],
    datePremiereConnexion: [],
    userInsertd: [],
  });

  private CODE_REGION = 'RG';
  private CODE_DEPARTEMENT = 'DP';
  private CODE_COMMUNE = 'CM';

  constructor(
    protected config: NgbDatepickerConfig,
    protected calendar: NgbCalendar,
    protected personneService: PersonneService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    private registerService: RegisterService,
    protected profilsService: ProfilsService,
    protected localiteService: LocaliteService,
    protected etablissementService: EtablissementService,
    protected rolesService: RolesService,
    protected typeLocaliteService: TypeLocaliteService,
    protected stateStorageService: StateStorageService
  ) {}

  ngOnInit(): void {
    this.config.maxDate = {
      day: this.calendar.getToday().day,
      month: this.calendar.getToday().month,
      year: this.calendar.getToday().year,
    };
    this.activatedRoute.data.subscribe(({ personne }) => {
      this.personne = personne;
      this.updateForm(personne);
      if (personne?.id !== undefined) {
        this.titre = 'Modifier utilisateur';
      } else {
        this.titre = 'Ajouter utilisateur';
      }
      this.updateForm(personne);
      this.loadRelationshipsOptions();
    });
  }

  onKeyUp(event: any): void {
    this.keys1 = event.target.value;
  }
  previousState(): void {
    window.history.back();
  }
  selectEvent(item: any): any {
    this.idEtablissement = item;
  }

  onChangeSearch(search: string): any {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e: any): any {
    // do something
  }
  getSelectedTypePiece(typePiece: any): void {
    this.typePieceChoisi = typePiece;

    if (this.typePieceChoisi.libelle === 'PASSEPORT') {
      this.isPasseport = true;
    }
  }
  onChoixSexe(param: string): void {
    this.isMasculin = false;
    if (param === 'Masculin') {
      this.isMasculin = true;
    }

    if (param === 'Féminin') {
      this.isMasculin = false;
    }
  }
  getDepartementsByRegion(idRegion: number | undefined): void {
    if (idRegion) {
      this.localiteService.findLocalitesByRattachement(idRegion).subscribe(
        (res: HttpResponse<ILocalite[]>) => {
          if (res.body) {
            this.departement = res.body;
            this.personne!.departement = undefined;
            this.commune = [];
            this.personne!.commune = undefined;
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
  }

  getSelectedGenre(genre: any): void {
    this.genreChoisi = genre;
  }

  getSelectedStatutMarital(statutMariral: any): void {
    this.statutMaritalChoisi = statutMariral;
  }
  getCommunesByDepartement(idDepartement: number | undefined): void {
    if (idDepartement) {
      this.localiteService.findLocalitesByRattachement(idDepartement).subscribe(
        (res: HttpResponse<ILocalite[]>) => {
          if (res.body) {
            this.commune = res.body;
            this.personne!.commune = undefined;
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
  }
  getEtablissementByLocalite(idLocalite: number | undefined): void {
    if (idLocalite) {
      this.etablissementService.findEtablissementByLocaliteId(idLocalite).subscribe(
        (res: HttpResponse<IEtablissement[]>) => {
          if (res.body) {
            this.etablissement = res.body;
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
  }

  LoadProfils(): void {
    this.profilsService
      .query()
      .pipe(map((res: HttpResponse<IProfils[]>) => res.body ?? []))
      .pipe(map((profils: IProfils[]) => this.profilsService.addProfilsToCollectionIfMissing(profils, this.editForm.get('profils')!.value)))
      .subscribe((profils: IProfils[]) => (this.profils = profils));

    this.etablissementService
      .query()
      .pipe(map((res: HttpResponse<IEtablissement[]>) => res.body ?? []))
      .pipe(
        map((etablissement: IEtablissement[]) =>
          this.etablissementService.addEtablissementToCollectionIfMissing(etablissement, this.editForm.get('etablissement')!.value)
        )
      )
      .subscribe((etablissement: IEtablissement[]) => (this.etablissement = etablissement));

    this.localiteService.findLocalitesByType(this.CODE_REGION).subscribe(
      (res: HttpResponse<ILocalite[]>) => {
        if (res.body) {
          this.region = res.body;
        }
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );

    this.localiteService.findLocalitesByType(this.CODE_DEPARTEMENT).subscribe(
      (res: HttpResponse<ILocalite[]>) => {
        if (res.body) {
          this.departement = res.body;
        }
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );

    this.localiteService.findLocalitesByType(this.CODE_COMMUNE).subscribe(
      (res: HttpResponse<ILocalite[]>) => {
        if (res.body) {
          this.commune = res.body;
        }
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );

    this.etablissementService
      .query()
      .pipe(map((res: HttpResponse<IEtablissement[]>) => res.body ?? []))
      .pipe(
        map((etablissements: IEtablissement[]) =>
          this.etablissementService.addEtablissementToCollectionIfMissing(etablissements, this.editForm.get('etablissement')!.value)
        )
      )
      .subscribe((etablissements: IEtablissement[]) => (this.etablissements = etablissements));
  }

  LoadTypeLocalite(): void {
    this.typeLocaliteService.query().subscribe(
      (res: HttpResponse<ITypeLocalite[]>) => {
        if (res.body) {
          this.champInterventions = res.body;
        }
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  save(): void {
    this.doNotMatch = false;
    this.error = false;
    this.isSaving = true;

    const password = this.motDePasse;
    if (password !== this.motDePasse) {
      this.doNotMatch = true;
    } else {
      const login = this.editForm.get(['login'])!.value;
      const email = this.editForm.get(['email'])!.value;
      const lastName = this.editForm.get(['nom'])!.value;
      const firstName = this.editForm.get(['prenom'])!.value;

      const personne = this.createFromForm();
      if (this.stateStorageService.getPersonne().profils?.libelle!.toUpperCase() === 'ADMINISTRATEUR') {
        personne.etablissement = this.stateStorageService.getPersonne().etablissement;
      }
      if (personne.id !== undefined) {
        personne.etablissement = this.stateStorageService.getPersonne().etablissement;
        this.subscribeToSaveResponse(this.personneService.update(personne));
      } else {
        this.registerService.save({ login, firstName, lastName, email, password, langKey: 'fr' }).subscribe(
          (data: UserInfos) => {
            this.success = true;
            personne.jhiUserId = data.id!;
            this.subscribeToSaveResponse(this.personneService.create(personne));
          },
          response => {
            this.processError(response);
          }
        );
      }
    }
  }

  trackProfilById(index: number, item: IProfils): number {
    return item.id!;
  }
  trackRegionById(index: number, item: ILocalite): number | null {
    if (item.id) {
      return item.id;
    } else {
      return null;
    }
  }

  trackDepartementById(index: number, item: ILocalite): number | null {
    if (item.id) {
      return item.id;
    } else {
      return null;
    }
  }

  trackCommuneById(index: number, item: ILocalite): number | null {
    if (item.id) {
      return item.id;
    } else {
      return null;
    }
  }

  trackChampInterventionById(index: number, item: ILocalite): number | null {
    if (item.id) {
      return item.id;
    } else {
      return null;
    }
  }
  trackEtablissementById(index: number, item: IEtablissement): number | null {
    if (item.id) {
      return item.id;
    } else {
      return null;
    }
  }
  trackRolesById(index: number, item: IRoles): number | null {
    if (item.id) {
      return item.id;
    } else {
      return null;
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPersonne>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    Swal.fire(`Utilisateur ajouté avec succés`, '', 'success');
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(personne: IPersonne): void {
    this.editForm.patchValue({
      id: personne.id,
      login: personne.login,
      password: personne.password,
      prenom: personne.prenom,
      nom: personne.nom,
      dateNaissance: personne.dateNaissance,
      lieuNaissance: personne.lieuNaissance,
      telephone: personne.telephone,
      typePiece: personne.typePiece,
      numeroPiece: personne.numeroPiece,
      email: personne.email,
      sexe: personne.sexe,
      profils: personne.profils,
      champIntervention: personne.champIntervention,
      region: personne.region,
      etablissement: this.idEtablissement,
      departement: personne.departement,
      commune: personne.commune,
      jhiUserId: personne.jhiUserId,
      dateDerniereConnexion: personne.dateDerniereConnexion,
    });
    this.profils = this.profilsService.addProfilsToCollectionIfMissing(this.profils, personne.profils);
    this.roles = this.rolesService.addRolesToCollectionIfMissing(this.roles, personne.roles);
    //this.etablissement = this.etablissementService.addEtablissementToCollectionIfMissing(this.etablissement, personne.etablissement);
  }

  protected loadRelationshipsOptions(): void {
    this.LoadProfils();
    this.LoadTypeLocalite();
  }
  protected onError(errorMessage: string): void {
    this.afficheMessage(errorMessage, 'error');
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
  protected createFromForm(): IPersonne {
    return {
      ...new Personne(),
      id: this.editForm.get(['id'])!.value,
      login: this.editForm.get(['login'])!.value,
      password: this.motDePasse,
      prenom: this.editForm.get(['prenom'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      dateNaissance: this.editForm.get(['dateNaissance'])!.value,
      lieuNaissance: this.editForm.get(['lieuNaissance'])!.value,
      telephone: this.editForm.get(['telephone'])!.value,
      typePiece: this.editForm.get(['typePiece'])!.value,
      numeroPiece: this.editForm.get(['numeroPiece'])!.value,
      email: this.editForm.get(['email'])!.value,
      sexe: this.editForm.get(['sexe'])!.value,
      profils: this.editForm.get(['profils'])!.value,
      champIntervention: this.editForm.get(['champIntervention'])!.value,
      region: this.editForm.get(['region'])!.value,
      departement: this.editForm.get(['departement'])!.value,
      jhiUserId: this.editForm.get(['jhiUserId'])!.value,
      commune: this.editForm.get(['commune'])!.value,
      dateDerniereConnexion: this.editForm.get(['dateDerniereConnexion'])!.value,
      etablissement: this.idEtablissement,
    };
  }
  private processError(response: HttpErrorResponse): void {
    if (response.status === 400 && response.error.type === LOGIN_ALREADY_USED_TYPE) {
      this.errorUserExists = true;
    } else if (response.status === 400 && response.error.type === EMAIL_ALREADY_USED_TYPE) {
      this.errorEmailExists = true;
    } else {
      this.error = true;
    }
  }
}
