import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TableTypeValeurComponent } from './list/table-type-valeur.component';
import { TableTypeValeurDetailComponent } from './detail/table-type-valeur-detail.component';
import { TableTypeValeurUpdateComponent } from './update/table-type-valeur-update.component';
import { TableTypeValeurDeleteDialogComponent } from './delete/table-type-valeur-delete-dialog.component';
import { TableTypeValeurRoutingModule } from './route/table-type-valeur-routing.module';

@NgModule({
  imports: [SharedModule, TableTypeValeurRoutingModule],
  declarations: [
    TableTypeValeurComponent,
    TableTypeValeurDetailComponent,
    TableTypeValeurUpdateComponent,
    TableTypeValeurDeleteDialogComponent,
  ],
  entryComponents: [TableTypeValeurDeleteDialogComponent],
})
export class TableTypeValeurModule {}
