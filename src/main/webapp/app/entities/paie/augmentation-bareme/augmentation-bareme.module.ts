import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AugmentationBaremeComponent } from './list/augmentation-bareme.component';
import { AugmentationBaremeDetailComponent } from './detail/augmentation-bareme-detail.component';
import { AugmentationBaremeUpdateComponent } from './update/augmentation-bareme-update.component';
import { AugmentationBaremeDeleteDialogComponent } from './delete/augmentation-bareme-delete-dialog.component';
import { AugmentationBaremeRoutingModule } from './route/augmentation-bareme-routing.module';

@NgModule({
  imports: [SharedModule, AugmentationBaremeRoutingModule],
  declarations: [
    AugmentationBaremeComponent,
    AugmentationBaremeDetailComponent,
    AugmentationBaremeUpdateComponent,
    AugmentationBaremeDeleteDialogComponent,
  ],
  entryComponents: [AugmentationBaremeDeleteDialogComponent],
})
export class AugmentationBaremeModule {}
