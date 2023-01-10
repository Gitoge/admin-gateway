import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CategorieAgentComponent } from './list/categorie-agent.component';
import { CategorieAgentDetailComponent } from './detail/categorie-agent-detail.component';
import { CategorieAgentUpdateComponent } from './update/categorie-agent-update.component';
import { CategorieAgentDeleteDialogComponent } from './delete/categorie-agent-delete-dialog.component';
import { CategorieAgentRoutingModule } from './route/categorie-agent-routing.module';

@NgModule({
  imports: [SharedModule, CategorieAgentRoutingModule],
  declarations: [
    CategorieAgentComponent,
    CategorieAgentDetailComponent,
    CategorieAgentUpdateComponent,
    CategorieAgentDeleteDialogComponent,
  ],
  entryComponents: [CategorieAgentDeleteDialogComponent],
})
export class CarriereCategorieAgentModule {}
