import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IService } from '../service.model';

import { ASC, CODE_FORCAGE, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { ServiceService } from '../service/service.service';
import { ServiceDeleteDialogComponent } from '../delete/service-delete-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-service',
  templateUrl: './service.component.html',
})
export class ServiceComponent implements OnInit {
  services?: IService[];
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
  service!: IService;

  constructor(
    protected serviceService: ServiceService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal
  ) {}

  loadAll(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    if (this.motCle === undefined) {
      this.serviceService
        .query({
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe({
          next: (res: HttpResponse<IService[]>) => {
            this.isLoading = false;
            this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
          },
          error: () => {
            this.isLoading = false;
            this.onError();
          },
        });
    } else {
      this.serviceService
        .findServicesByMotsCles(this.motCle, {
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe({
          next: (res: HttpResponse<IService[]>) => {
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
    this.services = [];
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

  trackId(_index: number, item: IService): number {
    return item.id!;
  }

  delete(service: IService): void {
    const modalRef = this.modalService.open(ServiceDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.service = service;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.reset();
      }
    });
  }

  /** DEBUT IMPLEMENTATION DU CODE DE FORCAGE  */

  openPopup(service: IService): void {
    this.service = service;
    this.displayStyle = 'block';
  }

  closePopup(): void {
    this.displayStyle = 'none';
  }

  validPopup(): void {
    if (this.codeForcage === CODE_FORCAGE) {
      if (this.service) {
        if (this.service.id) {
          this.router.navigate([`${'service'}/${this.service.id}/${'edit'}`]);
        }
        this.displayStyle = 'none';
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur...',
        text: 'Code de for??age incorrect !',
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

  protected onSuccess(data: IService[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/service'], {
        queryParams: {
          //   page: this.page,
          //  size: this.itemsPerPage,
          //   sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.services = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
