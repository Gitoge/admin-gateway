import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ArrondissementComponent } from './list/arrondissement.component';
import { ArrondissementDetailComponent } from './detail/arrondissement-detail.component';
import { ArrondissementUpdateComponent } from './update/arrondissement-update.component';
import { ArrondissementDeleteDialogComponent } from './delete/arrondissement-delete-dialog.component';
import { ArrondissementRoutingModule } from './route/arrondissement-routing.module';

@NgModule({
  imports: [SharedModule, ArrondissementRoutingModule],
  declarations: [
    ArrondissementComponent,
    ArrondissementDetailComponent,
    ArrondissementUpdateComponent,
    ArrondissementDeleteDialogComponent,
  ],
  entryComponents: [ArrondissementDeleteDialogComponent],
})
export class ArrondissementModule {}
