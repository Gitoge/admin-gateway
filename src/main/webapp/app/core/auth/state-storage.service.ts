import { Injectable } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';

import { UserInfos } from 'app/shared/model/userInfos';
import { PersonneService } from 'app/entities/personne/service/personne.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { PagesService } from 'app/entities/pages/service/pages.service';
import { IPages } from 'app/entities/pages/pages.model';
import { IPersonne } from 'app/entities/personne/personne.model';
import { IInfosUser } from 'app/shared/model/infosUser';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class StateStorageService {
  private previousUrlKey = 'previousUrl';

  constructor(
    private sessionStorageService: SessionStorageService,
    private personneService: PersonneService,
    private profileService: ProfileService,
    private pagesService: PagesService,
    private router: Router
  ) {}

  storeUrl(url: string): void {
    this.sessionStorageService.store(this.previousUrlKey, url);
  }

  getUrl(): string | null {
    return this.sessionStorageService.retrieve(this.previousUrlKey) as string | null;
  }

  clearUrl(): void {
    this.sessionStorageService.clear(this.previousUrlKey);
  }
  storeUserInfos(userInfos: string): void {
    this.sessionStorageService.store(this.previousUrlKey, userInfos);
  }
  getUserInfos1(): UserInfos {
    const obj: UserInfos = JSON.parse(localStorage.getItem('data-user')!);
    return obj;
  }
  getUserInfos(): UserInfos {
    const obj: UserInfos = JSON.parse(this.sessionStorageService.retrieve('userInfos'));
    return obj;
  }

  getDataUser(): UserInfos {
    return <UserInfos>JSON.parse(localStorage.getItem('data-user')!);
  }

  setModulesOfProfil(): void {
    const user_id = this.getDataUser().id as number;
    this.personneService.findByJhiUser(user_id).subscribe((response: any) => {
      /* localStorage.setItem('personne', JSON.stringify(response.body));
      localStorage.setItem('modules', JSON.stringify(response.body.profils.modules));
      localStorage.setItem('pages', JSON.stringify(response.body.pages));
      localStorage.setItem('profils', JSON.stringify(response.body.profils)); */

      this.sessionStorageService.store('personne', JSON.stringify(response.body));

      // window.location.reload(); // refresh menu navbar after getting modules profil
    });
  }

  setInfosuser(user_id: number): void {
    this.personneService.getInfosUser(user_id).subscribe(response => {
      localStorage.setItem('personne', JSON.stringify(response.body));
      localStorage.setItem('modules', JSON.stringify(response.body?.modules));
      localStorage.setItem('pages', JSON.stringify(response.body?.pages));
      localStorage.setItem('profils', JSON.stringify(response.body?.profils));
      console.error('response:::::::::::::::::', response.body);
      this.router.navigate(['']);
    });
  }

  getModulesOfProfil(): any {
    return JSON.parse(localStorage.getItem('modules')!);
  }

  getPagesAllModules(): any {
    return JSON.parse(localStorage.getItem('pages')!);
  }

  getProfils(): any {
    return JSON.parse(localStorage.getItem('profils')!);
  }

  getPersonne(): IPersonne {
    const obj: IPersonne = JSON.parse(localStorage.getItem('personne')!);
    return obj;
  }

  getActionsByPageCode(code_param: string): any {
    const pages = JSON.parse(localStorage.getItem('pages')!);
    let current_page: IPages;

    Object.keys(pages).map(key => {
      console.error('pages--> key', pages[key]);
      if (pages[key].code === code_param) {
        current_page = pages[key] as IPages;
      }
    });

    return current_page!.actions!;
  }
}
