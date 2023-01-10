import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEmplois } from '../emplois.model';

import { ASC, CODE_FORCAGE, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { EmploisService } from '../service/emplois.service';
import { EmploisDeleteDialogComponent } from '../delete/emplois-delete-dialog.component';
import Swal from 'sweetalert2';
import { PostesService } from '../../postes/service/postes.service';
import { PostesEmploisDialogComponent } from '../postes_emplois/roles_page-dialog.component';

@Component({
  selector: 'jhi-emplois',
  templateUrl: './emplois.component.html',
})
export class EmploisComponent implements OnInit {
  emplois?: IEmplois[];
  isLoading = false;
  motCle?: string;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  displayStyle = 'none';
  codeForcage!: string;
  emploi!: IEmplois;

  constructor(
    protected emploisService: EmploisService,
    protected activatedRoute: ActivatedRoute,
    protected postesService: PostesService,
    protected router: Router,
    protected modalService: NgbModal
  ) {}

  loadAll(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    if (this.motCle === undefined) {
      this.emploisService
        .query({
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe({
          next: (res: HttpResponse<IEmplois[]>) => {
            this.isLoading = false;
            this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
          },
          error: () => {
            this.isLoading = false;
            this.onError();
          },
        });
    } else {
      this.emploisService
        .recherche(this.motCle, {
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe({
          next: (res: HttpResponse<IEmplois[]>) => {
            this.isLoading = false;
            this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
          },
          error: () => {
            this.isLoading = false;
            this.onError();
          },
        });
    }
  }

  reset(): void {
    this.page = 0;
    this.emplois = [];
    this.loadAll();
  }

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.page = page;
    this.loadAll();
  }
  recherche(): void {
    this.loadPage();
  }
  effacer(): void {
    this.motCle = '';
    this.loadPage();
  }
  ngOnInit(): void {
    this.handleNavigation();
    this.motCle = '';
  }

  /** DEBUT IMPLEMENTATION DU CODE DE FORCAGE  */

  openPopup(emploi: IEmplois): void {
    this.emploi = emploi;
    this.displayStyle = 'block';
  }

  closePopup(): void {
    this.displayStyle = 'none';
  }

  validPopup(): void {
    if (this.codeForcage === CODE_FORCAGE) {
      if (this.emploi) {
        if (this.emploi.id) {
          this.router.navigate([`${'emplois'}/${this.emploi.id}/${'edit'}`]);
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

  trackId(_index: number, item: IEmplois): number {
    return item.id!;
  }

  getPoste(emplois: IEmplois): void {
    const modalRef = this.modalService.open(PostesEmploisDialogComponent, { size: 'lg', backdrop: 'static' });
    this.postesService.findByEmplois(emplois.id!).subscribe((resultEmplois: any) => {
      modalRef.componentInstance.postes = resultEmplois.body;
    });
    modalRef.componentInstance.emplois = emplois;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  delete(emplois: IEmplois): void {
    const modalRef = this.modalService.open(EmploisDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.emplois = emplois;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.reset();
      }
    });
  }

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

  protected onSuccess(data: IEmplois[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/emplois'], {
        queryParams: {
          //  page: this.page,
          //   size: this.itemsPerPage,
          //  sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.emplois = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
