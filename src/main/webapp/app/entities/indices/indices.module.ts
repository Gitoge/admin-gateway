import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { IndicesComponent } from './list/indices.component';
import { IndicesDetailComponent } from './detail/indices-detail.component';
import { IndicesUpdateComponent } from './update/indices-update.component';
import { IndicesDeleteDialogComponent } from './delete/indices-delete-dialog.component';
import { IndicesRoutingModule } from './route/indices-routing.module';

@NgModule({
  imports: [SharedModule, IndicesRoutingModule],
  declarations: [IndicesComponent, IndicesDetailComponent, IndicesUpdateComponent, IndicesDeleteDialogComponent],
  entryComponents: [IndicesDeleteDialogComponent],
})
export class IndicesModule {}
