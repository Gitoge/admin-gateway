import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProfilsComponent } from './list/profils.component';
import { ProfilsDetailComponent } from './detail/profils-detail.component';
import { ProfilsUpdateComponent } from './update/profils-update.component';
import { ProfilsDeleteDialogComponent } from './delete/profils-delete-dialog.component';
import { ProfilsRoutingModule } from './route/profils-routing.module';
import { RolesProfilDialogComponent } from './roles_profil/roles_profil-dialog.component';

@NgModule({
  imports: [SharedModule, ProfilsRoutingModule],
  declarations: [
    ProfilsComponent,
    ProfilsDetailComponent,
    ProfilsUpdateComponent,
    ProfilsDeleteDialogComponent,
    RolesProfilDialogComponent,
  ],
  entryComponents: [ProfilsDeleteDialogComponent],
})
export class ProfilsModule {}
