import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ExclusionAugmentationComponent } from './list/exclusion-augmentation.component';
import { ExclusionAugmentationDetailComponent } from './detail/exclusion-augmentation-detail.component';
import { ExclusionAugmentationUpdateComponent } from './update/exclusion-augmentation-update.component';
import { ExclusionAugmentationDeleteDialogComponent } from './delete/exclusion-augmentation-delete-dialog.component';
import { ExclusionAugmentationRoutingModule } from './route/exclusion-augmentation-routing.module';

@NgModule({
  imports: [SharedModule, ExclusionAugmentationRoutingModule],
  declarations: [
    ExclusionAugmentationComponent,
    ExclusionAugmentationDetailComponent,
    ExclusionAugmentationUpdateComponent,
    ExclusionAugmentationDeleteDialogComponent,
  ],
  entryComponents: [ExclusionAugmentationDeleteDialogComponent],
})
export class ExclusionAugmentationModule {}
