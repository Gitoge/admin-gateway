import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ParametreComponent } from './list/parametre.component';
import { ParametreDetailComponent } from './detail/parametre-detail.component';
import { ParametreUpdateComponent } from './update/parametre-update.component';
import { ParametreDeleteDialogComponent } from './delete/parametre-delete-dialog.component';
import { ParametreRoutingModule } from './route/parametre-routing.module';

@NgModule({
  imports: [SharedModule, ParametreRoutingModule],
  declarations: [ParametreComponent, ParametreDetailComponent, ParametreUpdateComponent, ParametreDeleteDialogComponent],
  entryComponents: [ParametreDeleteDialogComponent],
})
export class ParametreModule {}
