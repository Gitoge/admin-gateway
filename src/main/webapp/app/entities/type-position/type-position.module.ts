import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TypePositionComponent } from './list/type-position.component';
import { TypePositionDetailComponent } from './detail/type-position-detail.component';
import { TypePositionUpdateComponent } from './update/type-position-update.component';
import { TypePositionDeleteDialogComponent } from './delete/type-position-delete-dialog.component';
import { TypePositionRoutingModule } from './route/type-position-routing.module';

@NgModule({
  imports: [SharedModule, TypePositionRoutingModule],
  declarations: [TypePositionComponent, TypePositionDetailComponent, TypePositionUpdateComponent, TypePositionDeleteDialogComponent],
  entryComponents: [TypePositionDeleteDialogComponent],
})
export class TypePositionModule {}
