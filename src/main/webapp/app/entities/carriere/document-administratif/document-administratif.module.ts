import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DocumentAdministratifComponent } from './list/document-administratif.component';
import { DocumentAdministratifDetailComponent } from './detail/document-administratif-detail.component';
import { DocumentAdministratifUpdateComponent } from './update/document-administratif-update.component';
import { DocumentAdministratifRoutingModule } from './route/document-administratif-routing.module';
import { DocumentAdministratifDeleteDialogComponent } from './delete/document-administratif-delete-dialog.component';

@NgModule({
  imports: [SharedModule, DocumentAdministratifRoutingModule],
  declarations: [
    DocumentAdministratifComponent,
    DocumentAdministratifDetailComponent,
    DocumentAdministratifUpdateComponent,
    DocumentAdministratifDeleteDialogComponent,
  ],

  entryComponents: [
    DocumentAdministratifDeleteDialogComponent,
    DocumentAdministratifComponent,
    DocumentAdministratifDetailComponent,
    DocumentAdministratifUpdateComponent,
  ],
})
export class DocumentAdministratifModule {}
