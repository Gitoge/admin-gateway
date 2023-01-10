import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BilleteurComponent } from './list/billeteur.component';
import { BilleteurDetailComponent } from './detail/billeteur-detail.component';
import { BilleteurUpdateComponent } from './update/billeteur-update.component';
import { BilleteurDeleteDialogComponent } from './delete/billeteur-delete-dialog.component';
import { BilleteurRoutingModule } from './route/billeteur-routing.module';

@NgModule({
  imports: [SharedModule, BilleteurRoutingModule],
  declarations: [BilleteurComponent, BilleteurDetailComponent, BilleteurUpdateComponent, BilleteurDeleteDialogComponent],
  entryComponents: [BilleteurDeleteDialogComponent],
})
export class BilleteurModule {}
