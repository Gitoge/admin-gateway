import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AugmentationHierarchieComponent } from './list/augmentation-hierarchie.component';
import { AugmentationHierarchieDetailComponent } from './detail/augmentation-hierarchie-detail.component';
import { AugmentationHierarchieUpdateComponent } from './update/augmentation-hierarchie-update.component';
import { AugmentationHierarchieDeleteDialogComponent } from './delete/augmentation-hierarchie-delete-dialog.component';
import { AugmentationHierarchieRoutingModule } from './route/augmentation-hierarchie-routing.module';

@NgModule({
  imports: [SharedModule, AugmentationHierarchieRoutingModule],
  declarations: [
    AugmentationHierarchieComponent,
    AugmentationHierarchieDetailComponent,
    AugmentationHierarchieUpdateComponent,
    AugmentationHierarchieDeleteDialogComponent,
  ],
  entryComponents: [AugmentationHierarchieDeleteDialogComponent],
})
export class AugmentationHierarchieModule {}
