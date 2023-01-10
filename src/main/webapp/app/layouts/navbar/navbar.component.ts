import { Component, OnInit, Compiler, Injector, NgModuleFactory, Type } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SessionStorageService } from 'ngx-webstorage';

import { VERSION } from 'app/app.constants';
import { LANGUAGES } from 'app/config/language.constants';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { EntityNavbarItems } from 'app/entities/entity-navbar-items';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IPagesActions } from 'app/shared/model/pagesActions';
import { IPages } from 'app/entities/pages/pages.model';
import { timer } from 'rxjs';
import { IModules } from 'app/entities/modules/modules.model';
import { HttpResponse } from '@angular/common/http';
import { IPersonne } from '../../entities/personne/personne.model';
import { Observable } from 'rxjs';

import { finalize } from 'rxjs/operators';
import { PersonneService } from '../../entities/personne/service/personne.service';
@Component({
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  inProduction?: boolean;
  isNavbarCollapsed = true;
  languages = LANGUAGES;
  openAPIEnabled?: boolean;
  version = '';
  account: Account | null = null;
  entitiesNavbarItems: any[] = [];
  toggle = false;
  modules: any;
  personne: any;
  profils: any;
  pages_modules: any;
  userInfos: any;
  isSaving = false;
  success = false;

  modalRef?: NgbModalRef;

  pagesActions?: IPagesActions[] = [];

  pages?: IPages[] = [];

  constructor(
    private loginService: LoginService,
    private translateService: TranslateService,
    private sessionStorageService: SessionStorageService,
    protected personneService: PersonneService,
    private compiler: Compiler,
    private injector: Injector,
    private accountService: AccountService,
    private profileService: ProfileService,
    public stateStorageService: StateStorageService,
    private router: Router,
    protected modalService: NgbModal
  ) {
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
    }
  }

  ngOnInit(): void {
    this.entitiesNavbarItems = EntityNavbarItems;
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.openAPIEnabled = profileInfo.openAPIEnabled;
    });

    this.accountService.getAuthenticationState().subscribe(account => {
      if (account) {
        this.account = account;
        if (this.accountService.isAuthenticated()) {
          const personne = this.stateStorageService.getPersonne();
          if (this.accountService.isAuthenticated()) {
            const source = timer(250, 500);
            const abc = source.subscribe(val => {
              if (typeof this.stateStorageService.getPersonne().id! === 'undefined') {
                //this.stateStorageService.setInfosuser(account.id);
                //
                ///this.stateStorageService.setInfosuser(account.id);
                ////
                //alert(typeof this.stateStorageService.getPersonne()?.id)
              } else {
                //alert(1)
                this.personne = this.stateStorageService.getPersonne();
                this.modules = this.stateStorageService.getPersonne().modules;
                this.modules = this.modules.sort(function (a: IModules, b: IModules) {
                  if (a.ordre && b.ordre) {
                    return a.ordre < b.ordre ? -1 : 1;
                  }
                  return -1;
                });

                this.pages = this.stateStorageService.getPersonne().pages!;
                this.pages = this.pages.sort(function (a: IPages, b: IPages) {
                  if (a.ordre && b.ordre) {
                    return a.ordre < b.ordre ? -1 : 1;
                  }
                  return -1;
                });
                this.profils = this.stateStorageService.getProfils();
                this.pages_modules = this.stateStorageService.getPagesAllModules();
                this.userInfos = this.stateStorageService.getDataUser();
                this.pagesActions = this.stateStorageService.getPersonne().pagesActions;
                abc.unsubscribe();
              }
            });
          }
        }
      }

      //
    });
  }

  changeLanguage(languageKey: string): void {
    this.sessionStorageService.store('locale', languageKey);
    this.translateService.use(languageKey);
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.collapseNavbar();
    this.loginService.logout();
    this.router.navigate(['/login']);
    this.subscribeToSaveResponse(this.personneService.updateDerniereConnexion(this.stateStorageService.getPersonne().id!));
    this.account = null;
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPersonne>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveFinalize(): void {
    this.success = false;
  }

  protected onSaveSuccess(): void {
    this.logout();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }
  private loadModule(moduleType: Type<any>): void {
    const moduleFactory = this.compiler.compileModuleAndAllComponentsSync(moduleType);
    moduleFactory.ngModuleFactory.create(this.injector);
  }
}
