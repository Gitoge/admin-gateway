import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PagesComponent } from './list/pages.component';
import { PagesDetailComponent } from './detail/pages-detail.component';
import { PagesUpdateComponent } from './update/pages-update.component';
import { PagesDeleteDialogComponent } from './delete/pages-delete-dialog.component';
import { PagesRoutingModule } from './route/pages-routing.module';
import { RolesPageDialogComponent } from './roles_page/roles_page-dialog.component';

@NgModule({
  imports: [SharedModule, PagesRoutingModule],
  declarations: [PagesComponent, PagesDetailComponent, PagesUpdateComponent, PagesDeleteDialogComponent, RolesPageDialogComponent],
  entryComponents: [PagesDeleteDialogComponent],
})
export class PagesModule {}
