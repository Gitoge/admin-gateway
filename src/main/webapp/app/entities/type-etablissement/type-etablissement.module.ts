import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TypeEtablissementComponent } from './list/type-etablissement.component';
import { TypeEtablissementDetailComponent } from './detail/type-etablissement-detail.component';
import { TypeEtablissementUpdateComponent } from './update/type-etablissement-update.component';
import { TypeEtablissementDeleteDialogComponent } from './delete/type-etablissement-delete-dialog.component';
import { TypeEtablissementRoutingModule } from './route/type-etablissement-routing.module';

@NgModule({
  imports: [SharedModule, TypeEtablissementRoutingModule],
  declarations: [
    TypeEtablissementComponent,
    TypeEtablissementDetailComponent,
    TypeEtablissementUpdateComponent,
    TypeEtablissementDeleteDialogComponent,
  ],
  entryComponents: [TypeEtablissementDeleteDialogComponent],
})
export class TypeEtablissementModule {}
