import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IModules } from '../modules.model';

import { ASC, CODE_FORCAGE, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { ModulesService } from '../service/modules.service';
import { ModulesDeleteDialogComponent } from '../delete/modules-delete-dialog.component';

import { IApplications } from 'app/entities/applications/applications.model';
import { IPages } from 'app/entities/pages/pages.model';
import { PagesModuleDialogComponent } from '../pages_module/pages_module-dialog.component';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { IActions } from 'app/entities/actions/actions.model';
import { IPagesActions } from 'app/shared/model/pagesActions';
import { IPermissions } from 'app/shared/services/permissions';
import { PermissionsService } from 'app/shared/services/permissions.services';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-modules',
  templateUrl: './modules.component.html',
})
export class ModulesComponent implements OnInit {
  modules?: IModules[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  motCles!: string;

  displayStyle = 'none';

  codeForcage!: string;

  module!: IModules;

  currentAccount: any;
  error: any;

  applis!: IApplications[];
  appli: IApplications | undefined;
  pages!: IPages[];

  CODE_PAGE = 'GES_MODULE';

  permissions?: IPermissions;

  constructor(
    protected modulesService: ModulesService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    protected stateStorageService: StateStorageService,
    protected permissionsService: PermissionsService
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.modulesService
      .findModulesByMotsCles(this.motCles, {
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<IModules[]>) => {
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
    this.modules = [];
    this.loadPage();
  }

  ngOnInit(): void {
    this.permissions = this.permissionsService.getPermissions(this.CODE_PAGE, '');
    this.motCles = '';
    this.handleNavigation();
  }

  recherche(): void {
    this.loadPage();
  }

  effacer(): void {
    this.motCles = '';
    this.loadPage();
  }

  trackId(_index: number, item: IModules): number {
    return item.id!;
  }

  delete(modules: IModules): void {
    const modalRef = this.modalService.open(ModulesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.modules = modules;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  getPages(modules: IModules): void {
    if (modules.id) {
      this.modulesService.findPages(modules.id).subscribe((res: HttpResponse<IPages[]>) => {
        if (res.body !== null) {
          this.pages = res.body;
          modules.pages = res.body;
        }
      });
    }
    const modalRef = this.modalService.open(PagesModuleDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.modules = modules;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  /** DEBUT IMPLEMENTATION DU CODE DE FORCAGE  */
  openPopup(module: IModules): void {
    this.module = module;
    this.displayStyle = 'block';
  }

  closePopup(): void {
    this.displayStyle = 'none';
  }

  validPopup(): void {
    if (this.codeForcage === CODE_FORCAGE) {
      // this.codeForcage = "";
      if (this.module) {
        if (this.module.id) {
          this.router.navigate([`${'modules'}/${this.module.id}/${'edit'}`]);
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

  protected onSuccess(data: IModules[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/modules'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.modules = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
