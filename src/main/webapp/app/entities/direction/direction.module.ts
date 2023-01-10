import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DirectionComponent } from './list/direction.component';
import { DirectionDetailComponent } from './detail/direction-detail.component';
import { DirectionUpdateComponent } from './update/direction-update.component';
import { DirectionDeleteDialogComponent } from './delete/direction-delete-dialog.component';
import { DirectionRoutingModule } from './route/direction-routing.module';

@NgModule({
  imports: [SharedModule, DirectionRoutingModule],
  declarations: [DirectionComponent, DirectionDetailComponent, DirectionUpdateComponent, DirectionDeleteDialogComponent],
  entryComponents: [DirectionDeleteDialogComponent],
})
export class DirectionModule {}
