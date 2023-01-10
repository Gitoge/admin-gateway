import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { IEtablissement } from '../etablissement.model';
import { EtablissementService } from '../service/etablissement.service';
import { ITypeEtablissement } from 'app/entities/type-etablissement/type-etablissement.model';
import { TypeEtablissementService } from 'app/entities/type-etablissement/service/type-etablissement.service';
import { ILocalite } from 'app/entities/localite/localite.model';
import { LocaliteService } from 'app/entities/localite/service/localite.service';
import { IConvention } from 'app/entities/carriere/convention/convention.model';
import { ConventionService } from 'app/entities/carriere/convention/service/convention.service';
import { TypeLocaliteService } from 'app/entities/type-localite/service/type-localite.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-etablissement-update',
  templateUrl: './etablissement-update.component.html',
})
export class EtablissementUpdateComponent implements OnInit {
  etablissement!: IEtablissement;
  isSaving!: boolean;
  typeMessage?: string;
  _success = new Subject<string>();

  v_region!: ILocalite;
  v_departement!: ILocalite;
  v_commune!: ILocalite;

  regions: ILocalite[] = [];
  departements!: ILocalite[];
  communes!: ILocalite[];

  v_typeStructure: any;

  convention!: IConvention;

  typeEtablissementsSharedCollection: ITypeEtablissement[] = [];

  conventionsSharedCollection: IConvention[] = [];

  private CODE_REGION = 'RG';
  private CODE_DEPARTEMENT = 'DP';
  private CODE_COMMUNE = 'CM';

  constructor(
    protected etablissementService: EtablissementService,
    protected activatedRoute: ActivatedRoute,
    protected localiteService: LocaliteService,
    protected typeLocaliteService: TypeLocaliteService,
    protected typeEtablissementService: TypeEtablissementService,
    protected conventionService: ConventionService
  ) {}

  ngOnInit(): void {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ etablissement }) => {
      this.etablissement = etablissement;
    });

    this.typeEtablissementService
      .query()
      .pipe(map((res: HttpResponse<ITypeEtablissement[]>) => res.body ?? []))
      .pipe(
        map((typeEtablissements: ITypeEtablissement[]) =>
          this.typeEtablissementService.addTypeEtablissementToCollectionIfMissing(typeEtablissements)
        )
      )
      .subscribe((typeEtablissements: ITypeEtablissement[]) => (this.typeEtablissementsSharedCollection = typeEtablissements));

    this.conventionService
      .query()
      .pipe(map((res: HttpResponse<IConvention[]>) => res.body ?? []))
      .pipe(map((convention: IConvention[]) => this.conventionService.addConventionToCollectionIfMissing(convention)))
      .subscribe((convention: IConvention[]) => (this.conventionsSharedCollection = convention));

    this.getRegions();
    this.getDepartements();
    this.getCommunes();
  }

  save(): void {
    //ENREGISTREMENT ETABLISSEMENT
    this.isSaving = true;
    if (this.etablissement.id !== undefined) {
      this.subscribeToSaveResponse(this.etablissementService.update(this.etablissement));
      /*this.etablissementService.update(this.etablissement).subscribe(
        (res: HttpResponse<IEtablissement>) => {
          this.onSaveSuccessAndShow('Un établissement a été modifié avec succès');
        },
        (res: HttpErrorResponse) => {
          this.onSaveError();
        }
      );*/
    } else {
      this.etablissement.localite = this.v_commune;
      this.subscribeToSaveResponse(this.etablissementService.create(this.etablissement));

      /*this.etablissementService.create(this.etablissement).subscribe(
        (res: HttpResponse<IEtablissement>) => {
          this.onSaveSuccessAndShow('Un établissement a été créé avec succès');
        },
        (res: HttpErrorResponse) => {
          this.onSaveError();
        }
      );*/
    }
  }

  getRegions(): void {
    this.localiteService.findLocalitesByType(this.CODE_REGION).subscribe(
      (res: HttpResponse<ILocalite[]>) => {
        if (res.body) {
          this.regions = res.body;
        }
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  getDepartements(): void {
    this.localiteService.findLocalitesByType(this.CODE_DEPARTEMENT).subscribe(
      (res: HttpResponse<ILocalite[]>) => {
        if (res.body) {
          this.departements = res.body;
        }
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }
  getDepartementByRegion(idRegion: number | undefined): void {
    if (idRegion) {
      this.localiteService.findLocalitesByRattachement(idRegion).subscribe(
        (res: HttpResponse<ILocalite[]>) => {
          if (res.body) {
            this.departements = res.body;
          }
          //   this.etablissement.departementId = null;
          this.communes = [];
          //    this.etablissement.communeId = null;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
  }
  getCommunes(): void {
    this.localiteService.findLocalitesByType(this.CODE_COMMUNE).subscribe(
      (res: HttpResponse<ILocalite[]>) => {
        if (res.body) {
          this.communes = res.body;
        }
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }
  getCommunesByDepartement(idDepartement: number | undefined): void {
    if (idDepartement) {
      this.localiteService.findLocalitesByRattachement(idDepartement).subscribe(
        (res: HttpResponse<ILocalite[]>) => {
          if (res.body) {
            this.communes = res.body;
          }
          //  this.etablissement.communeId = null;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
  }

  trackTypeEtablissementById(_index: number, item: ITypeEtablissement): number {
    return item.id!;
  }

  trackLocaliteById(_index: number, item: ILocalite): number {
    return item.id!;
  }

  trackRegionById(index: number, item: ILocalite): number | null {
    if (item.id) {
      return item.id;
    } else {
      return null;
    }
  }

  trackConventionById(index: number, item: IConvention): number | null {
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

  previousState(): void {
    window.history.back();
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEtablissement>>): void {
    result.subscribe(
      (res: HttpResponse<IEtablissement>) => this.onSaveSuccess(res.body),
      (res: HttpErrorResponse) => this.onSaveError(res)
    );
  }

  protected onSaveSuccess(etablissement: IEtablissement | null): void {
    if (etablissement !== null) {
      this.etablissement = etablissement;

      this.isSaving = false;

      if (this.etablissement.id !== undefined) {
        Swal.fire(
          `<h4 style="font-family: Helvetica; font-size:16px">Etablissement <b>${
            etablissement?.libelleLong ?? ''
          }</b> enregistré avec succès</h4>`,
          '',
          'success'
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

  protected onError(message: string): void {
    throw new Error('Method not implemented.');
  }

  protected onSaveSuccessAndShow(successMessage: string): void {
    this.isSaving = false;
    this.previousState();
  }
}
