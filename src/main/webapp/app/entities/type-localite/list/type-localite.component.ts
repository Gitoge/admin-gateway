import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITypeLocalite } from '../type-localite.model';

import { ASC, CODE_FORCAGE, DESC, ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { TypeLocaliteService } from '../service/type-localite.service';
import { TypeLocaliteDeleteDialogComponent } from '../delete/type-localite-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-type-localite',
  templateUrl: './type-localite.component.html',
})
export class TypeLocaliteComponent implements OnInit {
  typeLocalites: ITypeLocalite[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;
  motCles!: string;

  displayStyle = 'none';
  codeForcage!: string;
  typeLocalite!: ITypeLocalite;

  constructor(
    protected typeLocaliteService: TypeLocaliteService,
    protected modalService: NgbModal,
    protected parseLinks: ParseLinks,
    protected activatedRoute: ActivatedRoute,
    protected router: Router
  ) {
    this.typeLocalites = [];
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

    this.typeLocaliteService
      .findTypeLocaliteByMotsCles(this.motCles, {
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<ITypeLocalite[]>) => {
          this.isLoading = false;
          this.paginateTypeLocalites(res.body, res.headers);
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  effacer(): void {
    this.motCles = '';
    this.loadAll();
  }

  reset(): void {
    this.page = 0;
    this.typeLocalites = [];
    this.loadAll();
  }

  recherche(): void {
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.motCles = '';
    this.loadAll();
  }

  trackId(_index: number, item: ITypeLocalite): number {
    return item.id!;
  }

  delete(typeLocalite: ITypeLocalite): void {
    if (this.codeForcage === CODE_FORCAGE) {
      const modalRef = this.modalService.open(TypeLocaliteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.typeLocalite = typeLocalite;
      // unsubscribe not needed because closed completes on modal close
      modalRef.closed.subscribe(reason => {
        if (reason === 'deleted') {
          this.reset();
        }
      });
    }
  }

  /** DEBUT IMPLEMENTATION DU CODE DE FORCAGE  */

  openPopup(typeLocalite: ITypeLocalite): void {
    this.typeLocalite = typeLocalite;
    this.displayStyle = 'block';
  }

  closePopup(): void {
    this.displayStyle = 'none';
  }

  validPopup(): void {
    if (this.codeForcage === CODE_FORCAGE) {
      // this.codeForcage = "";
      if (this.typeLocalite) {
        if (this.typeLocalite.id) {
          this.router.navigate([`${'type-localite'}/${this.typeLocalite.id}/${'edit'}`]);
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

  protected paginateTypeLocalites(data: ITypeLocalite[] | null, headers: HttpHeaders): void {
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
        this.typeLocalites.push(d);
      }
    }
  }
}
