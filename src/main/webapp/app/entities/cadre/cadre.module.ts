import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CadreComponent } from './list/cadre.component';
import { CadreDetailComponent } from './detail/cadre-detail.component';
import { CadreUpdateComponent } from './update/cadre-update.component';
import { CadreDeleteDialogComponent } from './delete/cadre-delete-dialog.component';
import { CadreRoutingModule } from './route/cadre-routing.module';

@NgModule({
  imports: [SharedModule, CadreRoutingModule],
  declarations: [CadreComponent, CadreDetailComponent, CadreUpdateComponent, CadreDeleteDialogComponent],
  entryComponents: [CadreDeleteDialogComponent],
})
export class CadreModule {}
