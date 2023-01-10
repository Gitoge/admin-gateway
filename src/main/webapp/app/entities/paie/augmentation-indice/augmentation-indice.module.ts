import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AugmentationIndiceComponent } from './list/augmentation-indice.component';
import { AugmentationIndiceDetailComponent } from './detail/augmentation-indice-detail.component';
import { AugmentationIndiceUpdateComponent } from './update/augmentation-indice-update.component';
import { AugmentationIndiceDeleteDialogComponent } from './delete/augmentation-indice-delete-dialog.component';
import { AugmentationIndiceRoutingModule } from './route/augmentation-indice-routing.module';

@NgModule({
  imports: [SharedModule, AugmentationIndiceRoutingModule],
  declarations: [
    AugmentationIndiceComponent,
    AugmentationIndiceDetailComponent,
    AugmentationIndiceUpdateComponent,
    AugmentationIndiceDeleteDialogComponent,
  ],
  entryComponents: [AugmentationIndiceDeleteDialogComponent],
})
export class AugmentationIndiceModule {}
