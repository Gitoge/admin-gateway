import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TableValeurComponent } from './list/table-valeur.component';
import { TableValeurDetailComponent } from './detail/table-valeur-detail.component';
import { TableValeurUpdateComponent } from './update/table-valeur-update.component';
import { TableValeurDeleteDialogComponent } from './delete/table-valeur-delete-dialog.component';
import { TableValeurRoutingModule } from './route/table-valeur-routing.module';

@NgModule({
  imports: [SharedModule, TableValeurRoutingModule],
  declarations: [TableValeurComponent, TableValeurDetailComponent, TableValeurUpdateComponent, TableValeurDeleteDialogComponent],
  entryComponents: [TableValeurDeleteDialogComponent],
})
export class TableValeurModule {}
