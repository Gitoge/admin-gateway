import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IPersonne } from '../personne.model';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { PersonneService } from '../service/personne.service';
import { PersonneDeleteDialogComponent } from '../delete/personne-delete-dialog.component';
import { StateStorageService } from '../../../core/auth/state-storage.service';

@Component({
  selector: 'jhi-personne',
  templateUrl: './personne.component.html',
})
export class PersonneComponent implements OnInit {
  personnes?: IPersonne[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  modalRef?: NgbModalRef;

  motCles!: string;

  constructor(
    protected personneService: PersonneService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    private stateStorageService: StateStorageService
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
    if (this.stateStorageService.getPersonne().profils?.libelle!.toUpperCase() === 'ADMINISTRATEUR') {
      this.personneService
        .findUserByAdminConect(this.motCles, this.stateStorageService.getPersonne().etablissement!.id!, {
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe({
          next: (res: HttpResponse<IPersonne[]>) => {
            this.isLoading = false;
            this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
          },
          error: () => {
            this.isLoading = false;
            this.onError();
          },
        });
    } else if (this.stateStorageService.getPersonne().profils?.libelle!.toUpperCase() === 'UTILISATEUR') {
      this.personneService
        .findUserByUserConect(this.motCles, this.stateStorageService.getPersonne().id!, {
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe({
          next: (res: HttpResponse<IPersonne[]>) => {
            this.isLoading = false;
            this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
          },
          error: () => {
            this.isLoading = false;
            this.onError();
          },
        });
    } else {
      this.personneService
        .findUserBySuperAdminConect(this.motCles, {
          page: pageToLoad - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe({
          next: (res: HttpResponse<IPersonne[]>) => {
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
  ngOnInit(): void {
    this.motCles = '';

    this.handleNavigation();
    console.error('Personnes ', this.stateStorageService.getPersonne());
  }
  recherche(): void {
    this.loadPage();
  }
  effacer(): void {
    this.motCles = '';
    this.loadPage();
  }

  trackId(_index: number, item: IPersonne): number {
    return item.id!;
  }

  delete(personne: IPersonne): void {
    const modalRef = this.modalService.open(PersonneDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.personne = personne;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
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

  protected onSuccess(data: IPersonne[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/personne'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.personnes = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
