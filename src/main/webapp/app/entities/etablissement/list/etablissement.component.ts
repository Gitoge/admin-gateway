import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEtablissement } from '../etablissement.model';

import { ASC, CODE_FORCAGE, DESC, ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { EtablissementService } from '../service/etablissement.service';
import { EtablissementDeleteDialogComponent } from '../delete/etablissement-delete-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ConventionService } from 'app/entities/carriere/convention/service/convention.service';
import { IConvention } from 'app/entities/carriere/convention/convention.model';
import Swal from 'sweetalert2';
import { ServicesOfEtablissementComponent } from '../services_of_etablissement/services_of_etablissement.component';
import { ServiceService } from 'app/entities/service/service/service.service';

@Component({
  selector: 'jhi-etablissement',
  templateUrl: './etablissement.component.html',
})
export class EtablissementComponent implements OnInit {
  etablissements: IEtablissement[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  motCles!: string;
  displayStyle = 'none';
  convention!: IConvention;
  conventionId!: number | null | undefined;

  codeForcage!: string;
  etablissement!: IEtablissement;

  constructor(
    protected etablissementService: EtablissementService,
    protected modalService: NgbModal,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected conventionService: ConventionService,
    protected serviceServices: ServiceService
  ) {
    this.etablissements = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.predicate = 'id';
    this.ascending = true;
  }

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.etablissementService
      .findEtablissementByMotsCles(this.motCles, {
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<IEtablissement[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        error: () => {
          this.isLoading = false;
          this.onError();
        },
      });
  }

  reset(): void {
    this.page = 0;
    this.etablissements = [];
    this.handleNavigation();
  }

  ngOnInit(): void {
    this.motCles = '';
    this.handleNavigation();
  }
  openPopup(): void {
    this.displayStyle = 'block';
  }
  closePopup(): void {
    this.displayStyle = 'none';
  }

  getServices(etablissement: IEtablissement): void {
    const modalRef = this.modalService.open(ServicesOfEtablissementComponent, { size: 'lg', backdrop: 'static' });
    this.serviceServices.findServicesByEtablissement(etablissement.id!).subscribe((resulEtablissement: any) => {
      modalRef.componentInstance.services = resulEtablissement.body;
    });
    modalRef.componentInstance.etablissement = etablissement;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  recherche(): void {
    this.loadPage();
  }
  effacer(): void {
    this.motCles = '';
    this.loadPage();
  }
  trackId(_index: number, item: IEtablissement): number {
    return item.id!;
  }

  delete(etablissement: IEtablissement): void {
    const modalRef = this.modalService.open(EtablissementDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.etablissement = etablissement;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.reset();
      }
    });
  }

  getConventionLibelle(etablissement: IEtablissement[]): void {
    for (let i = 1; i < etablissement.length; i++) {
      this.conventionId = etablissement[i].conventionId;
      if (this.conventionId) {
        this.conventionService.find(this.conventionId).subscribe((result: any) => {
          this.convention = result.body;
          // etablissement[i].convention = this.convention.libelle;
        });
      } else {
        if (this.conventionId === 0) {
          //  etablissement[i].convention = 'Non conventionné';
        }
      }
    }
  }

  /** DEBUT IMPLEMENTATION DU CODE DE FORCAGE  */

  openPopup1(etablissement: IEtablissement): void {
    this.etablissement = etablissement;
    this.displayStyle = 'block';
  }

  closePopup1(): void {
    this.displayStyle = 'none';
  }

  validPopup(): void {
    if (this.codeForcage === CODE_FORCAGE) {
      if (this.etablissement) {
        if (this.etablissement.id) {
          this.router.navigate([`${'etablissement'}/${this.etablissement.id}/${'edit'}`]);
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

  /** FIN IMPLEMENTATION DU CODE DE FORCAGE */

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? ASC : DESC)];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      const pageNumber = +(page ?? 1);
      // const sort = (params.get(SORT) ?? data['defaultSort']).split(',');
      const sort = ['id'];
      const predicate = sort[0];
      const ascending = sort[1] === ASC;
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
      }
    });
  }

  protected onSuccess(data: IEtablissement[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/etablissement'], {
        queryParams: {
          //  page: this.page,
          // size: this.itemsPerPage,
          // sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.etablissements = data ?? [];
    this.ngbPaginationPage = this.page;
    if (this.etablissements) {
      this.getConventionLibelle(this.etablissements);
    }
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
