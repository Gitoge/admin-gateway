import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IReglement } from '../reglement.model';

import { ASC, CODE_FORCAGE, DESC, ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ReglementService } from '../service/reglement.service';
import { ReglementDeleteDialogComponent } from '../delete/reglement-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-reglement',
  templateUrl: './reglement.component.html',
})
export class ReglementComponent implements OnInit {
  reglements: IReglement[];
  isLoading = false;
  displayStyle = 'none';
  codeForcage!: string;
  size = 'lg';
  backdrop = '';
  reglement!: IReglement;

  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(
    protected reglementService: ReglementService,
    protected modalService: NgbModal,
    protected parseLinks: ParseLinks,
    protected router: Router
  ) {
    this.reglements = [];
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

    this.reglementService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<IReglement[]>) => {
          this.isLoading = false;
          this.paginateReglements(res.body, res.headers);
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  reset(): void {
    this.page = 0;
    this.reglements = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IReglement): number {
    return item.id!;
  }

  /** DEBUT IMPLEMENTATION DU CODE DE FORCAGE  */

  openPopup(reglement: IReglement): void {
    this.reglement = reglement;
    this.displayStyle = 'block';
  }

  closePopup(): void {
    this.displayStyle = 'none';
  }

  validPopup(): void {
    if (this.codeForcage === CODE_FORCAGE) {
      if (this.reglement) {
        if (this.reglement.id) {
          this.router.navigate([`${'reglement'}/${this.reglement.id}/${'edit'}`]);
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

  delete(reglement: IReglement): void {
    const modalRef = this.modalService.open(ReglementDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.reglement = reglement;
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

  protected paginateReglements(data: IReglement[] | null, headers: HttpHeaders): void {
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
        this.reglements.push(d);
      }
    }
  }
}
