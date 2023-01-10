import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITypeDestinataires } from '../type-destinataires.model';

import { ASC, CODE_FORCAGE, DESC, ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { TypeDestinatairesService } from '../service/type-destinataires.service';
import { TypeDestinatairesDeleteDialogComponent } from '../delete/type-destinataires-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { IGrade } from '../../grade/grade.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-type-destinataires',
  templateUrl: './type-destinataires.component.html',
})
export class TypeDestinatairesComponent implements OnInit {
  typeDestinataires: ITypeDestinataires[];
  isLoading = false;
  displayStyle = 'none';
  codeForcage!: string;
  typeDestinataire!: ITypeDestinataires;
  size = 'lg';
  backdrop = '';

  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(
    protected typeDestinatairesService: TypeDestinatairesService,
    protected modalService: NgbModal,
    protected router: Router,
    protected parseLinks: ParseLinks
  ) {
    this.typeDestinataires = [];
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

    this.typeDestinatairesService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<ITypeDestinataires[]>) => {
          this.isLoading = false;
          this.paginateTypeDestinataires(res.body, res.headers);
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  reset(): void {
    this.page = 0;
    this.typeDestinataires = [];
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

  openPopup(typeDestinataire: ITypeDestinataires): void {
    this.typeDestinataire = typeDestinataire;
    this.displayStyle = 'block';
    this.size;
    this.backdrop = 'static';
  }

  closePopup(): void {
    this.displayStyle = 'none';
  }

  validPopup(): void {
    if (this.codeForcage === CODE_FORCAGE) {
      if (this.typeDestinataire) {
        if (this.typeDestinataire.id) {
          this.router.navigate([`${'type-destinataires'}/${this.typeDestinataire.id}/${'edit'}`]);
        }
        this.displayStyle = 'none';
        this.size;
        this.backdrop = 'static';
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

  trackId(_index: number, item: ITypeDestinataires): number {
    return item.id!;
  }

  delete(typeDestinataires: ITypeDestinataires): void {
    const modalRef = this.modalService.open(TypeDestinatairesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.typeDestinataires = typeDestinataires;
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

  protected paginateTypeDestinataires(data: ITypeDestinataires[] | null, headers: HttpHeaders): void {
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
        this.typeDestinataires.push(d);
      }
    }
  }
}
