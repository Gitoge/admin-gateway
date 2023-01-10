import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FichePaie, IFichePaie } from '../fiche-paie.model';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { FichePaieService } from '../service/fiche-paie.service';
import { FichePaieDeleteDialogComponent } from '../delete/fiche-paie-delete-dialog.component';
import { FormBuilder, Validators } from '@angular/forms';
import { AgentService } from '../../../carriere/agent/service/agent.service';
import { SituationAdministrativeService } from '../../../carriere/situation-administrative/service/situation-administrative.service';
import { EmploisService } from '../../../emplois/service/emplois.service';
import { EtablissementService } from '../../../etablissement/service/etablissement.service';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import { IEtablissement } from 'app/entities/etablissement/etablissement.model';
import { IPeriodePaye } from '../../periode-paye/periode-paye.model';
import { PeriodePayeService } from '../../periode-paye/service/periode-paye.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'jhi-fiche-paie-update',
  templateUrl: './fiche-paie-update.component.html',
})
export class FichePaieUpdateComponent implements OnInit {
  fichePaies?: IFichePaie[];
  fiche: any;
  matricule: any;
  agent?: any;
  libelleEmplois: any;
  libelleEtablissement: any;
  agentId: any;
  sitAdmin: any;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  documentDefinition: any;

  etablissementSharedCollection: IEtablissement[] = [];
  agentIds!: number[];
  etablissementId!: number;
  keyword = 'libelleLong';

  periodePayeEnCours!: IPeriodePaye;

  etatPeriodePayeEnCours!: string;

  editForm = this.fb.group({
    matricule: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(7)]],
    etablissementId: [],
  });
  @ViewChild('testPDF', { static: false }) testPDF!: ElementRef;

  constructor(
    protected fichePaieService: FichePaieService,
    protected activatedRoute: ActivatedRoute,
    protected situationAdministrativeService: SituationAdministrativeService,
    protected emploisService: EmploisService,
    protected etablissementService: EtablissementService,
    protected periodePayeService: PeriodePayeService,
    protected agentService: AgentService,
    protected router: Router,
    protected modalService: NgbModal,
    protected fb: FormBuilder
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.fichePaieService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<IFichePaie[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        error: () => {
          this.isLoading = false;
          this.onError();
        },
      });

    this.etablissementService
      .findAll()
      .pipe(map((res: HttpResponse<IEtablissement[]>) => res.body ?? []))
      .pipe(
        map((etablissement: IEtablissement[]) =>
          this.etablissementService.addEtablissementToCollectionIfMissing(etablissement, this.editForm.get('etablissementId')!.value)
        )
      )
      .subscribe((etablissement: IEtablissement[]) => (this.etablissementSharedCollection = etablissement));
  }

  // pour l'impression des bulletins de solde

  public downloadPdf(): void {
    const pdfTable = this.testPDF.nativeElement;
    const html = htmlToPdfmake(pdfTable.innerHTML.fontsize(1));
    this.documentDefinition = {
      content: pdfTable.innerHTML.fontsize(1),
    };
    const c = pdfMake.createPdf(this.documentDefinition);
    c.open();
  }

  public openPDF(): void {
    const DATA: any = document.getElementById('testPDF');
    html2canvas(DATA).then(canvas => {
      const fileWidth = 210;
      const fileHeight = (canvas.height * fileWidth) / canvas.width;

      const FILEURI = canvas.toDataURL('image/png');
      const PDF = new jsPDF('p', 'mm', 'a4');
      const position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('bulletin-salaire.pdf');
    });
  }

  ngOnInit(): void {
    this.etatPeriodePayeEnCours = '';
    this.periodePayeService.findPeriodeEnCours().subscribe((res: any) => {
      this.periodePayeEnCours = res.body;
      if (this.periodePayeEnCours.statut) {
        this.etatPeriodePayeEnCours = this.periodePayeEnCours.statut;
      }
    });
    this.handleNavigation();
  }

  trackId(_index: number, item: IFichePaie): number {
    return item.id!;
  }

  delete(fichePaie: IFichePaie): void {
    const modalRef = this.modalService.open(FichePaieDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.fichePaie = fichePaie;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  getAgentByMatricule(matricule: any): void {
    this.agentService.findAgentByMatricule(matricule).subscribe((result: any) => {
      this.agent = result.body[0];
      console.error('Agent', this.agent);
      this.agentId = this.agent.id;
      if (result.body[0] === undefined) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur...',
          text: 'Matricule Introuvable !',
        });
      }
      // Infos Fiche
      this.agentService.genererFichePaie(result.body[0].id).subscribe(
        (resultFiche: any) => {
          this.fiche = resultFiche.body;
          console.error('fiche paie', resultFiche.body);

          if (this.fiche === undefined || this.fiche.length === 0) {
            Swal.fire({
              icon: 'error',
              title: 'Erreur...',
              text: 'fiche paie  introuvable !',
            });
          } else {
            Swal.fire({
              icon: 'success',
              title: 'Succés...',
              text: 'Generation fiche effectuée avec succés !',
            });
          }
        },
        err => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur...',
            text: err.error.message,
          });
          // console.error(err.error.message);
        }
      );

      // Infos Situation administrative
      this.situationAdministrativeService.findByAgent(this.agentId).subscribe((resultSit: any) => {
        console.error('sit Admin', resultSit.body);
        this.sitAdmin = resultSit.body;

        // infos emplois
        this.emploisService.findByCode(resultSit.body.codeEmplois).subscribe((resultEmplois: any) => {
          console.error('emplois ', resultEmplois.body.libelle);
          this.libelleEmplois = resultEmplois.body.libelle;
        });

        // infos etablissement
        this.etablissementService.findEtablissementById(resultSit.body.etablissement).subscribe((resultEtab: any) => {
          console.error('emplois ', resultEtab.body.libelle);
          this.libelleEtablissement = resultEtab.body.libelleLong;
        });
      });
    });
  }

  genereFichePaieByEtablissement(agentIds: number[]): void {
    for (let i = 0; i < agentIds.length; i++) {
      this.agentService.genererFichePaie(agentIds[i]).subscribe(
        (rs: any) => {
          if (rs.body.length > 0) {
            Swal.fire({
              icon: 'success',
              title: 'Success...',
              text: 'Génération terminée avec Succès !',
            });
          }
        },
        err => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur...',
            text: err.error.message,
          });
          // console.error(err.error.message);
        }
      );
    }
  }

  genererFichePaieForAllAgent(): void {
    this.agentService.genererFichePaieForAll().subscribe(
      (rs: any) => {
        if (rs.body.length === 0) {
          Swal.fire({
            icon: 'success',
            title: 'Success...',
            text: 'Génération terminée avec Succès !',
          });
        }
      },
      err => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur...',
          text: err.error.message,
        });
        // console.error(err.error.message);
      }
    );
  }

  selectEventEtablissement(item: any): any {
    if (item) {
      this.agentService.findByEtablissement(item.id).subscribe((result: any) => {
        this.agentIds = result.body;
        console.error(this.agentIds);
      });
    }
  }

  onChangeSearch(search: any): any {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e: any): any {
    // do something
  }

  getSelectedEtablissement(etablissementId: number | null | undefined): void {
    if (etablissementId !== null && etablissementId !== undefined) {
      this.etablissementId = etablissementId;
    }
    console.error(this.etablissementId);
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
      // const sort = (params.get(SORT) ?? data['defaultSort']).split(',');
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

  protected onSuccess(data: IFichePaie[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/fiche-paie'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.fichePaies = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }

  protected createFromForm(): IFichePaie {
    return {
      ...new FichePaie(),
      matricule: this.editForm.get(['matricule'])!.value,
    };
  }
}
