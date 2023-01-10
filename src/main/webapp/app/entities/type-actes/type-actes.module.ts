import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TypeActesComponent } from './list/type-actes.component';
import { TypeActesDetailComponent } from './detail/type-actes-detail.component';
import { TypeActesUpdateComponent } from './update/type-actes-update.component';
import { TypeActesDeleteDialogComponent } from './delete/type-actes-delete-dialog.component';
import { TypeActesRoutingModule } from './route/type-actes-routing.module';

@NgModule({
  imports: [SharedModule, TypeActesRoutingModule],
  declarations: [TypeActesComponent, TypeActesDetailComponent, TypeActesUpdateComponent, TypeActesDeleteDialogComponent],
  entryComponents: [TypeActesDeleteDialogComponent],
})
export class TypeActesModule {}
