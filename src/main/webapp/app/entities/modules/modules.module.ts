import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ModulesComponent } from './list/modules.component';
import { ModulesDetailComponent } from './detail/modules-detail.component';
import { ModulesUpdateComponent } from './update/modules-update.component';
import { ModulesDeleteDialogComponent } from './delete/modules-delete-dialog.component';
import { ModulesRoutingModule } from './route/modules-routing.module';
import { PagesModuleDialogComponent } from './pages_module/pages_module-dialog.component';

@NgModule({
  imports: [SharedModule, ModulesRoutingModule],
  declarations: [
    ModulesComponent,
    ModulesDetailComponent,
    ModulesUpdateComponent,
    ModulesDeleteDialogComponent,
    PagesModuleDialogComponent,
  ],
  entryComponents: [ModulesDeleteDialogComponent],
})
export class ModulesModule {}
