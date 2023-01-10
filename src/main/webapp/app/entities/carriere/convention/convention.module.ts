import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ConventionComponent } from './list/convention.component';
import { ConventionDetailComponent } from './detail/convention-detail.component';
import { ConventionUpdateComponent } from './update/convention-update.component';
import { ConventionDeleteDialogComponent } from './delete/convention-delete-dialog.component';
import { ConventionRoutingModule } from './route/convention-routing.module';

@NgModule({
  imports: [SharedModule, ConventionRoutingModule],
  declarations: [ConventionComponent, ConventionDetailComponent, ConventionUpdateComponent, ConventionDeleteDialogComponent],
  entryComponents: [ConventionDeleteDialogComponent],
})
export class CarriereConventionModule {}
