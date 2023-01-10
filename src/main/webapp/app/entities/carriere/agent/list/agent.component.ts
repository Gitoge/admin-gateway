import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal, NgbNav, NgbNavChangeEvent, NgbNavContent, NgbNavLink } from '@ng-bootstrap/ng-bootstrap';

import { IAgent } from '../agent.model';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { AgentService } from '../service/agent.service';
import { AgentDeleteDialogComponent } from '../delete/agent-delete-dialog.component';
import dayjs from 'dayjs';
import { FormBuilder, Validators } from '@angular/forms';
import { ISituationFamiliale } from '../../situation-familiale/situation-familiale.model';
import { ISituationAdministrative } from '../../situation-administrative/situation-administrative.model';
import { IEmoluments } from 'app/entities/paie/emoluments/emoluments.model';
import { INationalite } from '../../nationalite/nationalite.model';
import { NationaliteService } from '../../nationalite/service/nationalite.service';
import { SituationAdministrativeService } from '../../situation-administrative/service/situation-administrative.service';
import { SituationFamilialeService } from '../../situation-familiale/service/situation-familiale.service';
import { EnfantService } from '../../enfant/service/enfant.service';
import { IEnfant } from '../../enfant/enfant.model';
import { HierarchieService } from 'app/entities/hierarchie/service/hierarchie.service';
import { EchelonService } from 'app/entities/echelon/service/echelon.service';
import { PositionsService } from 'app/entities/positions/service/positions.service';
import { IndicesService } from 'app/entities/carriere/indices/service/indices.service';
import { GradeService } from 'app/entities/grade/service/grade.service';
import { EtablissementService } from 'app/entities/etablissement/service/etablissement.service';
import { EmploisService } from 'app/entities/emplois/service/emplois.service';
import { ServiceService } from 'app/entities/service/service/service.service';
import { IHierarchie } from 'app/entities/hierarchie/hierarchie.model';
import { IEchelon } from 'app/entities/echelon/echelon.model';
import { IPositions } from 'app/entities/positions/positions.model';
import { IIndices } from '../../indices/indices.model';
import { IGrade } from 'app/entities/grade/grade.model';
import { IEtablissement } from 'app/entities/etablissement/etablissement.model';
import { IEmplois } from 'app/entities/emplois/emplois.model';
import { IService } from 'app/entities/service/service.model';
import { EmolumentsService } from 'app/entities/paie/emoluments/service/emoluments.service';
import Swal from 'sweetalert2';
import { PersonneService } from 'app/entities/personne/service/personne.service';
import { IPersonne } from 'app/entities/personne/personne.model';

@Component({
  selector: 'jhi-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./design.scss'],
})
export class AgentComponent implements OnInit {
  agents?: IAgent[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  agent!: IAgent;

  situationFamilialeAgent!: ISituationFamiliale;

  situationAdministrativeAgent!: ISituationAdministrative;

  elemntFixe!: IEmoluments;

  today: any;

  active: any;

  matricule!: string | undefined;
  remuneration!: string | undefined;
  numeroPiece: string | undefined;
  prenom: string | undefined;
  nom: string | undefined;
  dateNaissance?: any | null;
  lieuNaissance: string | undefined;
  sexe: string | undefined;
  nationalite?: INationalite | null;
  telephone?: string | null;
  email?: string | null;
  adresse?: string | null;
  nomMari?: string | null;
  nombreEpouses?: number | null;
  travailConjoint?: string | null;

  hierarchie?: IHierarchie;
  echelon?: IEchelon;
  positions?: IPositions;
  indices?: IIndices;

  soldeGlobal?: number;
  grade?: IGrade;
  etablissement?: IEtablissement;
  emploi?: IEmplois;
  service?: IService;
  reglement?: any;
  operateurSaisie!: IPersonne;

  initiales: any;

  situationAdministrative!: ISituationAdministrative;
  situationFamiliale!: ISituationFamiliale;
  enfants!: IEnfant[];
  emoluments!: IEmoluments[];

  editForm = this.fb.group({
    id: [],
    matricule: [],
    prenom: [],
    nom: [],
    dateNaissance: [],
    dateRecrutement: [],
  });

  constructor(
    protected agentService: AgentService,
    protected nationaliteService: NationaliteService,
    protected hierarchieService: HierarchieService,
    protected echelonService: EchelonService,
    protected positionsService: PositionsService,
    protected indicesService: IndicesService,
    protected gradeService: GradeService,
    protected etablissementService: EtablissementService,
    protected emploiService: EmploisService,
    protected servicesService: ServiceService,
    protected situationAdministrativeService: SituationAdministrativeService,
    protected situationFamilialeService: SituationFamilialeService,
    protected enfantService: EnfantService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    protected fb: FormBuilder,
    protected emolumenstService: EmolumentsService,
    protected personneService: PersonneService
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;
  }

  ngOnInit(): void {
    this.matricule = '';
    this.remuneration = '';
    this.numeroPiece = '';
    this.prenom = '';
    this.nom = '';
    this.lieuNaissance = '';
    this.sexe = '';
    this.telephone = '';
    this.email = '';
    this.adresse = '';
    this.nomMari = '';
    this.nombreEpouses = 0;
    this.travailConjoint = '';
    this.initiales = ' ';
    this.handleNavigation();
    const today = dayjs().startOf('day');
  }

  trackId(_index: number, item: IAgent): number {
    return item.id!;
  }

  delete(agent: IAgent): void {
    const modalRef = this.modalService.open(AgentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.agent = agent;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  getAgentByMatricule(matricule: any): void {
    this.agentService.findAgentByMatricule(matricule).subscribe((result: any) => {
      this.agents = result.body;
      if (this.agents === undefined || this.agents.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur...',
          text: 'Matricule introuvable !',
        });
      } else {
        this.agent = this.agents[0];
      }
    });
  }

  chargerInfos(agent: IAgent): void {
    this.matricule = agent.matricule;
    this.numeroPiece = agent.numeroPiece;
    this.prenom = agent.prenom;
    this.nom = agent.nom;
    this.dateNaissance = agent.dateNaissance;
    this.lieuNaissance = agent.lieuNaissance;
    this.sexe = agent.sexe;
    this.telephone = agent.telephone;
    this.email = agent.email;
    if (agent.nationalite?.id) {
      this.nationaliteService.find(agent.nationalite?.id).subscribe((nationalite: any) => {
        this.nationalite = nationalite.body;
      });
    }
    this.adresse = agent.adresse;
    this.nomMari = agent.nomMari;

    if (agent.id) {
      this.situationAdministrativeService.findByAgent(agent.id).subscribe((result: any) => {
        this.situationAdministrative = result.body;
        console.error(this.situationAdministrative);
        if (this.situationAdministrative.codeRemuneration !== null && this.situationAdministrative.codeRemuneration !== undefined) {
          if (this.situationAdministrative.codeRemuneration === 1) {
            this.remuneration = 'SALAIRE INDICIAIRE';
          }

          if (this.situationAdministrative.codeRemuneration === 4) {
            this.remuneration = 'SOLDE GLOBALE';
          }
        }
        if (this.situationAdministrative.hierarchieId) {
          this.hierarchieService.find(this.situationAdministrative.hierarchieId).subscribe((hierarchie: any) => {
            this.hierarchie = hierarchie.body;
          });
        }

        if (this.situationAdministrative.gradeId) {
          this.gradeService.find(this.situationAdministrative.gradeId).subscribe((grade: any) => {
            this.grade = grade.body;
          });
        }

        if (this.situationAdministrative.echelonId) {
          this.echelonService.find(this.situationAdministrative.echelonId).subscribe((echelon: any) => {
            this.echelon = echelon.body;
          });
        }

        if (this.situationAdministrative.hierarchieId) {
          this.hierarchieService.find(this.situationAdministrative.hierarchieId).subscribe((hierarchie: any) => {
            this.hierarchie = hierarchie.body;
          });
        }

        if (this.situationAdministrative.position) {
          this.positionsService.find(this.situationAdministrative.position).subscribe((position: any) => {
            this.positions = position.body;
          });
        }

        if (this.situationAdministrative.etablissement) {
          this.etablissementService.find(this.situationAdministrative.etablissement).subscribe((etablissement: any) => {
            this.etablissement = etablissement.body;
          });
        }

        if (this.situationAdministrative.emploisId) {
          this.emploiService.find(this.situationAdministrative.emploisId).subscribe((emploi: any) => {
            this.emploi = emploi.body;
          });
        }

        if (this.situationAdministrative.servicesId) {
          this.servicesService.find(this.situationAdministrative.servicesId).subscribe((service: any) => {
            this.service = service.body;
          });
        }

        if (this.situationAdministrative.indice) {
          if (this.situationAdministrative.indice.id) {
            this.indicesService.find(this.situationAdministrative.indice.id).subscribe((indice: any) => {
              this.indices = indice.body;
            });
          }
        }

        if (this.situationAdministrative.typePec) {
          if (this.situationAdministrative.typePec === 'PEC_RECRUT') {
            this.situationAdministrative.typePec = ' PRISE EN COMPTE RECRUTEMENT ';
          }

          if (this.situationAdministrative.typePec === 'PEC_CONTRAT') {
            this.situationAdministrative.typePec = ' PRISE EN COMPTE CONTRAT';
          }
        }
      });

      this.situationFamilialeService.findByAgent(agent.id).subscribe((result: any) => {
        this.situationFamiliale = result.body;
        if (this.situationFamiliale.nombreEpouse !== null && this.situationFamiliale.nombreEpouse !== undefined) {
          this.nombreEpouses = this.situationFamiliale.nombreEpouse;
        }

        if (this.situationFamiliale.conjointSalarie) {
          this.travailConjoint = 'OUI';
        } else {
          this.travailConjoint = 'NON';
        }
      });

      this.enfantService.findByAgent(agent.id).subscribe((result: any) => {
        this.enfants = result.body;
      });

      if (agent.matricule) {
        this.emolumenstService.findEmolumentsByMatricule(agent.matricule).subscribe((result: any) => {
          this.emoluments = result.body;
        });
      }

      if (agent.userInsertId) {
        this.personneService.find(agent.userInsertId).subscribe((result: any) => {
          this.operateurSaisie = result.body;
          this.initiales = this.operateurSaisie.prenom?.concat(' ').concat(this.operateurSaisie.nom!);
        });
      }
    }
  }

  getAgentByMotCle(prenom: any, nom: any): void {
    this.agentService.findAgentByMotCle(prenom, nom).subscribe(
      (result: any) => {
        this.agents = result.body;
        if (this.agents === undefined || this.agents.length === 0) {
          Swal.fire({
            icon: 'error',
            title: 'Erreur...',
            text: 'Aucun enregistrement correspondant !',
          });
        } else {
          this.agent = this.agents[0];
        }
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur...',
          text: 'Aucun enregistrement correspondant !',
        });
      }
    );
  }
  changePageSuivante(tab: NgbNav): void {
    tab.select('infos-agent');
  }

  onNavChange(changeEvent: NgbNavChangeEvent): void {
    // if (changeEvent.nextId === 3) {
    //   changeEvent.preventDefault();
    // }
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

  protected onSuccess(data: IAgent[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/agent'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.agents = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
