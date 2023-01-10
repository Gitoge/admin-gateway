import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HistoAugmentationComponent } from './list/histo-augmentation.component';
import { HistoAugmentationDetailComponent } from './detail/histo-augmentation-detail.component';
import { HistoAugmentationUpdateComponent } from './update/histo-augmentation-update.component';
import { HistoAugmentationDeleteDialogComponent } from './delete/histo-augmentation-delete-dialog.component';
import { HistoAugmentationRoutingModule } from './route/histo-augmentation-routing.module';

@NgModule({
  imports: [SharedModule, HistoAugmentationRoutingModule],
  declarations: [
    HistoAugmentationComponent,
    HistoAugmentationDetailComponent,
    HistoAugmentationUpdateComponent,
    HistoAugmentationDeleteDialogComponent,
  ],
  entryComponents: [HistoAugmentationDeleteDialogComponent],
})
export class HistoAugmentationModule {}
