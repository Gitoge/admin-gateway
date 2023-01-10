import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDestinataires } from '../destinataires.model';

import { ASC, CODE_FORCAGE, DESC, ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { DestinatairesService } from '../service/destinataires.service';
import { DestinatairesDeleteDialogComponent } from '../delete/destinataires-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { IGrade } from '../../grade/grade.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-destinataires',
  templateUrl: './destinataires.component.html',
})
export class DestinatairesComponent implements OnInit {
  destinataires: IDestinataires[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  displayStyle = 'none';
  codeForcage!: string;
  destinataire!: IDestinataires;
  size = 'lg';
  backdrop = '';

  page: number;
  predicate: string;
  ascending: boolean;
  titre!: string;

  constructor(
    protected destinatairesService: DestinatairesService,
    protected modalService: NgbModal,
    protected parseLinks: ParseLinks,
    protected router: Router
  ) {
    this.destinataires = [];
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

    this.destinatairesService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<IDestinataires[]>) => {
          this.isLoading = false;
          this.paginateDestinataires(res.body, res.headers);
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  reset(): void {
    this.page = 0;
    this.destinataires = [];
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

  openPopup(destinataire: IDestinataires): void {
    this.destinataire = destinataire;
    this.displayStyle = 'block';
    this.size;
    this.backdrop = 'static';
  }

  closePopup(): void {
    this.displayStyle = 'none';
  }

  validPopup(): void {
    if (this.codeForcage === CODE_FORCAGE) {
      if (this.destinataire) {
        if (this.destinataire.id) {
          this.router.navigate([`${'destinataires'}/${this.destinataire.id}/${'edit'}`]);
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

  trackId(_index: number, item: IDestinataires): number {
    return item.id!;
  }

  delete(destinataires: IDestinataires): void {
    const modalRef = this.modalService.open(DestinatairesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.destinataires = destinataires;
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

  protected paginateDestinataires(data: IDestinataires[] | null, headers: HttpHeaders): void {
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
        this.destinataires.push(d);
      }
    }
  }
}
