import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DestinatairesComponent } from './list/destinataires.component';
import { DestinatairesDetailComponent } from './detail/destinataires-detail.component';
import { DestinatairesUpdateComponent } from './update/destinataires-update.component';
import { DestinatairesDeleteDialogComponent } from './delete/destinataires-delete-dialog.component';
import { DestinatairesRoutingModule } from './route/destinataires-routing.module';

@NgModule({
  imports: [SharedModule, DestinatairesRoutingModule],
  declarations: [DestinatairesComponent, DestinatairesDetailComponent, DestinatairesUpdateComponent, DestinatairesDeleteDialogComponent],
  entryComponents: [DestinatairesDeleteDialogComponent],
})
export class DestinatairesModule {}
