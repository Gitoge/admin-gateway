import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { IPriseEnCompte } from '../prise-en-compte.model';
import { PriseEnCompteService } from '../service/prise-en-compte.service';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { IEtablissement } from '../../../etablissement/etablissement.model';
import { INationalite } from '../../nationalite/nationalite.model';

import { IConvention } from '../../convention/convention.model';
@Component({
  selector: 'jhi-prise-en-compte-update',
  templateUrl: './prise-en-compte-update.component.html',
  styleUrls: ['../prise-en-compte.scss'],
})
export class PriseEnCompteUpdateComponent implements OnInit {
  priseEnCompte!: IPriseEnCompte;

  matricule?: string;
  typePiece?: string;
  numeroPiece?: string;
  numeroPasseport?: string;
  prenom?: string;
  nom?: string;
  sexe?: string;
  dateNaissance?: dayjs.Dayjs;
  lieuNaissance?: string;
  nationalite?: INationalite | null;
  telephone?: string | null;
  adresse?: string | null;
  email?: string | null;

  isSaving!: boolean;

  active: any;

  today: any;

  etablissementSharedCollection: IEtablissement[] = [];

  constructor(protected priseEnCompteService: PriseEnCompteService, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ priseEnCompte }) => {
      this.priseEnCompte = priseEnCompte;
      console.error(priseEnCompte);
      this.numeroPiece = this.priseEnCompte?.numeroPiece;
    });
  }

  save(): void {
    //ENREGISTREMENT ETABLISSEMENT
    console.error(this.priseEnCompte);
    this.isSaving = true;
    if (this.priseEnCompte.id !== undefined) {
      // this.subscribeToSaveResponse(this.priseEnCompteService.update(this.priseEnCompte));
      this.priseEnCompteService.update(this.priseEnCompte).subscribe(
        (res: HttpResponse<IPriseEnCompte>) => {
          this.onSaveSuccessAndShow('Une prise en compte a été modifié avec succès');
        },
        (res: HttpErrorResponse) => {
          this.onSaveError();
        }
      );
    }
  }

  trackConventionById(index: number, item: IConvention): number | null {
    if (item.id) {
      return item.id;
    } else {
      return null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  onNavChange(changeEvent: NgbNavChangeEvent): void {
    // if (changeEvent.nextId === 2) {
    //   const priseEncompte = this.priseEnCompte;
    //   if (
    //     priseEncompte.typePiece === null ||
    //     priseEncompte.typePiece === undefined ||
    //     priseEncompte.numeroPiece === null ||
    //     priseEncompte.numeroPiece === undefined ||
    //     priseEncompte.prenom === null ||
    //     priseEncompte.prenom === undefined ||
    //     priseEncompte.nom === null ||
    //     priseEncompte.nom === undefined ||
    //     priseEncompte.dateNaissance === null ||
    //     priseEncompte.dateNaissance === undefined ||
    //     priseEncompte.lieuNaissance === null ||
    //     priseEncompte.lieuNaissance === undefined ||
    //     priseEncompte.sexe === null ||
    //     priseEncompte.sexe === undefined ||
    //     priseEncompte.nationalite === null ||
    //     priseEncompte.nationalite === undefined ||
    //     priseEncompte.telephone === null ||
    //     priseEncompte.telephone === undefined ||
    //     priseEncompte.servicesId === null ||
    //     priseEncompte.servicesId === undefined ||
    //     priseEncompte.adresse === null ||
    //     priseEncompte.adresse === undefined
    //   ) {
    //     Swal.fire({
    //       icon: 'error',
    //       title: 'Erreur...',
    //       text: " Veuillez renseigner tous les champs obligatoires avant l'étape suivante !",
    //     });
    //     changeEvent.preventDefault();
    //   }
    // }
    // if (changeEvent.nextId === 3) {
    //   const priseEncompte = this.priseEnCompte;
    //   if (
    //     priseEncompte.natureActe === null ||
    //     priseEncompte.natureActe === undefined ||
    //     priseEncompte.etablissementId === null ||
    //     priseEncompte.etablissementId === undefined ||
    //     priseEncompte.dateRecrutement === null ||
    //     priseEncompte.dateRecrutement === undefined ||
    //     // priseEncompte.typeRemuneration === null ||
    //     // priseEncompte.typeRemuneration === undefined ||
    //     priseEncompte.categorieAgent === null ||
    //     priseEncompte.categorieAgent === undefined ||
    //     priseEncompte.datePriseRang === null ||
    //     priseEncompte.datePriseRang === undefined ||
    //     priseEncompte.position === null ||
    //     priseEncompte.position === undefined ||
    //     priseEncompte.datedebut === null ||
    //     priseEncompte.datedebut === undefined ||
    //     priseEncompte.datefin === null ||
    //     priseEncompte.datefin === undefined ||
    //     priseEncompte.servicesId === null ||
    //     priseEncompte.servicesId === undefined ||
    //     priseEncompte.modeReglement === undefined ||
    //     priseEncompte.modeReglement === undefined
    //   ) {
    //     Swal.fire({
    //       icon: 'error',
    //       title: 'Erreur...',
    //       text: " Veuillez renseigner tous les champs obligatoires avant l'étape suivante !",
    //     });
    //     changeEvent.preventDefault();
    //   }
    // }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPriseEnCompte>>): void {
    result.subscribe(
      (res: HttpResponse<IPriseEnCompte>) => this.onSaveSuccess(),
      (res: HttpErrorResponse) => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  protected onError(message: string): void {
    throw new Error('Method not implemented.');
  }

  protected onSaveSuccessAndShow(successMessage: string): void {
    this.isSaving = false;
    this.previousState();
  }
}
