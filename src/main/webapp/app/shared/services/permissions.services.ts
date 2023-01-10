import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { IPermissions } from './permissions';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  constructor(protected stateStorageService: StateStorageService, private router: Router) {}

  getPermissions(codePage: string, action: string): IPermissions {
    const pagesActions = this.stateStorageService.getPersonne().pagesActions!;
    const permissions: IPermissions = {
      actionAjout: false,
      actionModifier: false,
      actionDetails: false,
      actionPages: false,
      actionSupprimer: false,
      acces: false,
    };
    for (const pageAction of pagesActions) {
      // alert(page.code);
      if (pageAction.pages && codePage === pageAction.pages.code) {
        permissions.acces = true;
        if (pageAction.actions && pageAction.actions.code === 'AJOUT') {
          permissions.actionAjout = true;
        } else if (pageAction.actions && pageAction.actions.code === 'MODIF') {
          permissions.actionModifier = true;
        } else if (pageAction.actions && pageAction.actions.code === 'SUPP') {
          permissions.actionSupprimer = true;
        } else if (pageAction.actions && pageAction.actions.code === 'CONS') {
          permissions.actionDetails = true;
        }
      }
    }
    if (
      !permissions.acces ||
      (action === 'AJOUT' && !permissions.actionAjout) ||
      (action === 'MODIF' && !permissions.actionModifier) ||
      (action === 'SUPP' && !permissions.actionSupprimer) ||
      (action === 'CONS' && !permissions.actionDetails)
    ) {
      this.router.navigate(['']);
    }
    return permissions;
  }
}
