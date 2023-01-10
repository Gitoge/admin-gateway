import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CODE_FORCAGE } from 'app/config/pagination.constants';
import Swal from 'sweetalert2';

import { ITypeEtablissement } from '../type-etablissement.model';

@Component({
  selector: 'jhi-type-etablissement-detail',
  templateUrl: './type-etablissement-detail.component.html',
})
export class TypeEtablissementDetailComponent implements OnInit {
  typeEtablissement: ITypeEtablissement | null = null;

  displayStyle = 'none';

  codeForcage!: string;
  typeEtab!: ITypeEtablissement;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeEtablissement }) => {
      this.typeEtablissement = typeEtablissement;
    });
  }

  previousState(): void {
    window.history.back();
  }

  /** DEBUT IMPLEMENTATION DU CODE DE FORCAGE  */
  /*
  openPopup(typeEtab: ITypeEtablissement): void {
    this.typeEtab = typeEtab;
    this.displayStyle = 'block';
  }

  closePopup(): void {
    this.displayStyle = 'none';
  }

  validPopup(): void {
    if (this.codeForcage === CODE_FORCAGE) {
      // this.codeForcage = "";
      if (this.typeEtab) {
        if (this.typeEtab.id) {
          this.router.navigate([`${'type-etablissement'}/${this.typeEtab.id}/${'edit'}`]);
        }
        this.displayStyle = 'none';
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur...',
        text: 'Code de forçage incorrect !',
      });
    }
    this.codeForcage = '';
  } 

  */

  /** FIN IMPLEMENTATION DU CODE DE FORCAGE */
}
