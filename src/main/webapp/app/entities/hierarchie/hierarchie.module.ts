import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HierarchieComponent } from './list/hierarchie.component';
import { HierarchieDetailComponent } from './detail/hierarchie-detail.component';
import { HierarchieUpdateComponent } from './update/hierarchie-update.component';
import { HierarchieDeleteDialogComponent } from './delete/hierarchie-delete-dialog.component';
import { HierarchieRoutingModule } from './route/hierarchie-routing.module';

@NgModule({
  imports: [SharedModule, HierarchieRoutingModule],
  declarations: [HierarchieComponent, HierarchieDetailComponent, HierarchieUpdateComponent, HierarchieDeleteDialogComponent],
  entryComponents: [HierarchieDeleteDialogComponent],
})
export class HierarchieModule {}
