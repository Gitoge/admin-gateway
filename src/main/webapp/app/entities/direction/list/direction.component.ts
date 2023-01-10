import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDirection } from '../direction.model';

import { ASC, CODE_FORCAGE, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { DirectionService } from '../service/direction.service';
import { DirectionDeleteDialogComponent } from '../delete/direction-delete-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-direction',
  templateUrl: './direction.component.html',
})
export class DirectionComponent implements OnInit {
  directions?: IDirection[];
  motCle?: string;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  displayStyle = 'none';
  codeForcage!: string;
  direction!: IDirection;

  constructor(
    protected directionService: DirectionService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal
  ) {
    this.directions = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    if (this.motCle === undefined) {
      this.directionService
        .query({
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe({
          next: (res: HttpResponse<IDirection[]>) => {
            this.isLoading = false;
            this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
          },
          error: () => {
            this.isLoading = false;
            this.onError();
          },
        });
    } else {
      this.directionService
        .findDirectionsByMotsCles(this.motCle, {
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe({
          next: (res: HttpResponse<IDirection[]>) => {
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
    this.directions = [];
    this.loadAll();
  }

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.handleNavigation();
    this.motCle = '';
  }

  recherche(): void {
    this.loadPage();
  }

  effacer(): void {
    this.motCle = '';
    this.loadPage();
  }

  trackId(_index: number, item: IDirection): number {
    return item.id!;
  }

  delete(direction: IDirection): void {
    const modalRef = this.modalService.open(DirectionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.direction = direction;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.reset();
      }
    });
  }

  /** DEBUT IMPLEMENTATION DU CODE DE FORCAGE  */

  openPopup(direction: IDirection): void {
    this.direction = direction;
    this.displayStyle = 'block';
  }

  closePopup(): void {
    this.displayStyle = 'none';
  }

  validPopup(): void {
    if (this.codeForcage === CODE_FORCAGE) {
      if (this.direction) {
        if (this.direction.id) {
          this.router.navigate([`${'direction'}/${this.direction.id}/${'edit'}`]);
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

  protected onSuccess(data: IDirection[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/direction'], {
        queryParams: {
          // page: this.page,
          //  size: this.itemsPerPage,
          //  sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.directions = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
