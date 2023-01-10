import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TypeReglementComponent } from './list/type-reglement.component';
import { TypeReglementDetailComponent } from './detail/type-reglement-detail.component';
import { TypeReglementUpdateComponent } from './update/type-reglement-update.component';
import { TypeReglementDeleteDialogComponent } from './delete/type-reglement-delete-dialog.component';
import { TypeReglementRoutingModule } from './route/type-reglement-routing.module';

@NgModule({
  imports: [SharedModule, TypeReglementRoutingModule],
  declarations: [TypeReglementComponent, TypeReglementDetailComponent, TypeReglementUpdateComponent, TypeReglementDeleteDialogComponent],
  entryComponents: [TypeReglementDeleteDialogComponent],
})
export class TypeReglementModule {}
