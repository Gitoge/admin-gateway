import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TypeDestinatairesComponent } from './list/type-destinataires.component';
import { TypeDestinatairesDetailComponent } from './detail/type-destinataires-detail.component';
import { TypeDestinatairesUpdateComponent } from './update/type-destinataires-update.component';
import { TypeDestinatairesDeleteDialogComponent } from './delete/type-destinataires-delete-dialog.component';
import { TypeDestinatairesRoutingModule } from './route/type-destinataires-routing.module';

@NgModule({
  imports: [SharedModule, TypeDestinatairesRoutingModule],
  declarations: [
    TypeDestinatairesComponent,
    TypeDestinatairesDetailComponent,
    TypeDestinatairesUpdateComponent,
    TypeDestinatairesDeleteDialogComponent,
  ],
  entryComponents: [TypeDestinatairesDeleteDialogComponent],
})
export class TypeDestinatairesModule {}
