import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { StructureAdminComponent } from './list/structure-admin.component';
import { StructureAdminDetailComponent } from './detail/structure-admin-detail.component';
import { StructureAdminUpdateComponent } from './update/structure-admin-update.component';
import { StructureAdminDeleteDialogComponent } from './delete/structure-admin-delete-dialog.component';
import { StructureAdminRoutingModule } from './route/structure-admin-routing.module';

@NgModule({
  imports: [SharedModule, StructureAdminRoutingModule],
  declarations: [
    StructureAdminComponent,
    StructureAdminDetailComponent,
    StructureAdminUpdateComponent,
    StructureAdminDeleteDialogComponent,
  ],
  entryComponents: [StructureAdminDeleteDialogComponent],
})
export class StructureAdminModule {}
