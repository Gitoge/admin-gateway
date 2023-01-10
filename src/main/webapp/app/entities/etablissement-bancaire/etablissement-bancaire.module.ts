import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EtablissementBancaireComponent } from './list/etablissement-bancaire.component';
import { EtablissementBancaireDetailComponent } from './detail/etablissement-bancaire-detail.component';
import { EtablissementBancaireUpdateComponent } from './update/etablissement-bancaire-update.component';
import { EtablissementBancaireDeleteDialogComponent } from './delete/etablissement-bancaire-delete-dialog.component';
import { EtablissementBancaireRoutingModule } from './route/etablissement-bancaire-routing.module';

@NgModule({
  imports: [SharedModule, EtablissementBancaireRoutingModule],
  declarations: [
    EtablissementBancaireComponent,
    EtablissementBancaireDetailComponent,
    EtablissementBancaireUpdateComponent,
    EtablissementBancaireDeleteDialogComponent,
  ],
  entryComponents: [EtablissementBancaireDeleteDialogComponent],
})
export class EtablissementBancaireModule {}
