import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITypeReglement } from '../type-reglement.model';

import { ASC, CODE_FORCAGE, DESC, ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { TypeReglementService } from '../service/type-reglement.service';
import { TypeReglementDeleteDialogComponent } from '../delete/type-reglement-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-type-reglement',
  templateUrl: './type-reglement.component.html',
})
export class TypeReglementComponent implements OnInit {
  typeReglements: ITypeReglement[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;
  motCle?: string;
  displayStyle = 'none';
  codeForcage!: string;
  size = 'lg';
  backdrop = '';
  typeReglement!: ITypeReglement;

  constructor(
    protected typeReglementService: TypeReglementService,
    protected modalService: NgbModal,
    protected parseLinks: ParseLinks,
    protected router: Router
  ) {
    this.typeReglements = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(): void {
    this.isLoading = true;

    this.typeReglementService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<ITypeReglement[]>) => {
          this.isLoading = false;
          this.paginateTypeReglements(res.body, res.headers);
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  reset(): void {
    this.page = 0;
    this.typeReglements = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  /** DEBUT IMPLEMENTATION DU CODE DE FORCAGE  */

  openPopup(typeReglement: ITypeReglement): void {
    this.typeReglement = typeReglement;
    this.displayStyle = 'block';
  }

  closePopup(): void {
    this.displayStyle = 'none';
  }

  validPopup(): void {
    if (this.codeForcage === CODE_FORCAGE) {
      if (this.typeReglement) {
        if (this.typeReglement.id) {
          this.router.navigate([`${'type-reglement'}/${this.typeReglement.id}/${'edit'}`]);
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

  trackId(_index: number, item: ITypeReglement): number {
    return item.id!;
  }

  delete(typeReglement: ITypeReglement): void {
    const modalRef = this.modalService.open(TypeReglementDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.typeReglement = typeReglement;
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

  protected paginateTypeReglements(data: ITypeReglement[] | null, headers: HttpHeaders): void {
    const linkHeader = headers.get('link');
    if (linkHeader) {
      this.links = this.parseLinks.parse(linkHeader);
    } else {
      this.links = {
        last: 0,
      };
    }
    if (data) {
      for (const d of data) {
        this.typeReglements.push(d);
      }
    }
  }
}
