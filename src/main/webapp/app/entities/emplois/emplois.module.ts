import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EmploisComponent } from './list/emplois.component';
import { EmploisDetailComponent } from './detail/emplois-detail.component';
import { EmploisUpdateComponent } from './update/emplois-update.component';
import { EmploisDeleteDialogComponent } from './delete/emplois-delete-dialog.component';
import { EmploisRoutingModule } from './route/emplois-routing.module';
import { PostesEmploisDialogComponent } from './postes_emplois/roles_page-dialog.component';

@NgModule({
  imports: [SharedModule, EmploisRoutingModule],
  declarations: [
    EmploisComponent,
    EmploisDetailComponent,
    EmploisUpdateComponent,
    EmploisDeleteDialogComponent,
    PostesEmploisDialogComponent,
  ],
  entryComponents: [EmploisDeleteDialogComponent],
})
export class EmploisModule {}
