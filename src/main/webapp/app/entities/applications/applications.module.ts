import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ApplicationsComponent } from './list/applications.component';
import { ApplicationsDetailComponent } from './detail/applications-detail.component';
import { ApplicationsUpdateComponent } from './update/applications-update.component';
import { ApplicationsDeleteDialogComponent } from './delete/applications-delete-dialog.component';
import { ApplicationsRoutingModule } from './route/applications-routing.module';

@NgModule({
  imports: [SharedModule, ApplicationsRoutingModule],
  declarations: [ApplicationsComponent, ApplicationsDetailComponent, ApplicationsUpdateComponent, ApplicationsDeleteDialogComponent],
  entryComponents: [ApplicationsDeleteDialogComponent],
})
export class ApplicationsModule {}
