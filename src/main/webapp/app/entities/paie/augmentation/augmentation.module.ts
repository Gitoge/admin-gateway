import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AugmentationComponent } from './list/augmentation.component';
import { AugmentationDetailComponent } from './detail/augmentation-detail.component';
import { AugmentationUpdateComponent } from './update/augmentation-update.component';
import { AugmentationDeleteDialogComponent } from './delete/augmentation-delete-dialog.component';
import { AugmentationRoutingModule } from './route/augmentation-routing.module';

@NgModule({
  imports: [SharedModule, AugmentationRoutingModule],
  declarations: [AugmentationComponent, AugmentationDetailComponent, AugmentationUpdateComponent, AugmentationDeleteDialogComponent],
  entryComponents: [AugmentationDeleteDialogComponent],
})
export class AugmentationModule {}
