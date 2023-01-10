import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEtablissementBancaire } from '../etablissement-bancaire.model';

import { ASC, CODE_FORCAGE, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { EtablissementBancaireService } from '../service/etablissement-bancaire.service';
import { EtablissementBancaireDeleteDialogComponent } from '../delete/etablissement-bancaire-delete-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-etablissement-bancaire',
  templateUrl: './etablissement-bancaire.component.html',
})
export class EtablissementBancaireComponent implements OnInit {
  etablissementBancaires?: IEtablissementBancaire[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  displayStyle = 'none';
  codeForcage!: string;
  etablissementBancaire!: IEtablissementBancaire;

  constructor(
    protected etablissementBancaireService: EtablissementBancaireService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.etablissementBancaireService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<IEtablissementBancaire[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        error: () => {
          this.isLoading = false;
          this.onError();
        },
      });
  }

  ngOnInit(): void {
    this.handleNavigation();
  }

  trackId(_index: number, item: IEtablissementBancaire): number {
    return item.id!;
  }

  delete(etablissementBancaire: IEtablissementBancaire): void {
    const modalRef = this.modalService.open(EtablissementBancaireDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.etablissementBancaire = etablissementBancaire;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  /** DEBUT IMPLEMENTATION DU CODE DE FORCAGE  */

  openPopup(etablissementBancaire: IEtablissementBancaire): void {
    this.etablissementBancaire = etablissementBancaire;
    this.displayStyle = 'block';
  }

  closePopup(): void {
    this.displayStyle = 'none';
  }

  validPopup(): void {
    if (this.codeForcage === CODE_FORCAGE) {
      if (this.etablissementBancaire) {
        if (this.etablissementBancaire.id) {
          this.router.navigate([`${'etablissement-bancaire'}/${this.etablissementBancaire.id}/${'edit'}`]);
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
      const sort = (params.get(SORT) ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === ASC;
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
      }
    });
  }

  protected onSuccess(data: IEtablissementBancaire[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/etablissement-bancaire'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.etablissementBancaires = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
