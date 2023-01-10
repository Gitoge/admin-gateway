import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ElementsVariablesComponent } from './list/elements-variables.component';
import { ElementsVariablesDetailComponent } from './detail/elements-variables-detail.component';
import { ElementsVariablesUpdateComponent } from './update/elements-variables-update.component';
import { ElementsVariablesDeleteDialogComponent } from './delete/elements-variables-delete-dialog.component';
import { ElementsVariablesRoutingModule } from './route/elements-variables-routing.module';

@NgModule({
  imports: [SharedModule, ElementsVariablesRoutingModule],
  declarations: [
    ElementsVariablesComponent,
    ElementsVariablesDetailComponent,
    ElementsVariablesUpdateComponent,
    ElementsVariablesDeleteDialogComponent,
  ],
  entryComponents: [ElementsVariablesDeleteDialogComponent],
})
export class PaieElementsVariablesModule {}
