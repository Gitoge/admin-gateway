import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EtablissementComponent } from './list/etablissement.component';
import { EtablissementDetailComponent } from './detail/etablissement-detail.component';
import { EtablissementUpdateComponent } from './update/etablissement-update.component';
import { EtablissementDeleteDialogComponent } from './delete/etablissement-delete-dialog.component';
import { EtablissementRoutingModule } from './route/etablissement-routing.module';
// search module
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ServicesOfEtablissementComponent } from './services_of_etablissement/services_of_etablissement.component';

@NgModule({
  imports: [SharedModule, EtablissementRoutingModule, Ng2SearchPipeModule],
  declarations: [
    EtablissementComponent,
    EtablissementDetailComponent,
    EtablissementUpdateComponent,
    EtablissementDeleteDialogComponent,
    ServicesOfEtablissementComponent,
  ],
  entryComponents: [EtablissementDeleteDialogComponent],
})
export class EtablissementModule {}
