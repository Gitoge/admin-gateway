import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CorpsComponent } from './list/corps.component';
import { CorpsDetailComponent } from './detail/corps-detail.component';
import { CorpsUpdateComponent } from './update/corps-update.component';
import { CorpsDeleteDialogComponent } from './delete/corps-delete-dialog.component';
import { CorpsRoutingModule } from './route/corps-routing.module';

@NgModule({
  imports: [SharedModule, CorpsRoutingModule],
  declarations: [CorpsComponent, CorpsDetailComponent, CorpsUpdateComponent, CorpsDeleteDialogComponent],
  entryComponents: [CorpsDeleteDialogComponent],
})
export class CorpsModule {}
