import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LocaliteComponent } from './list/localite.component';
import { LocaliteDetailComponent } from './detail/localite-detail.component';
import { LocaliteUpdateComponent } from './update/localite-update.component';
import { LocaliteDeleteDialogComponent } from './delete/localite-delete-dialog.component';
import { LocaliteRoutingModule } from './route/localite-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [SharedModule, LocaliteRoutingModule, Ng2SearchPipeModule],
  declarations: [LocaliteComponent, LocaliteDetailComponent, LocaliteUpdateComponent, LocaliteDeleteDialogComponent],
  entryComponents: [LocaliteDeleteDialogComponent],
})
export class LocaliteModule {}
