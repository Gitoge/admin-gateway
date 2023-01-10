import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TypeLocaliteComponent } from './list/type-localite.component';
import { TypeLocaliteDetailComponent } from './detail/type-localite-detail.component';
import { TypeLocaliteUpdateComponent } from './update/type-localite-update.component';
import { TypeLocaliteDeleteDialogComponent } from './delete/type-localite-delete-dialog.component';
import { TypeLocaliteRoutingModule } from './route/type-localite-routing.module';

@NgModule({
  imports: [SharedModule, TypeLocaliteRoutingModule],
  declarations: [TypeLocaliteComponent, TypeLocaliteDetailComponent, TypeLocaliteUpdateComponent, TypeLocaliteDeleteDialogComponent],
  entryComponents: [TypeLocaliteDeleteDialogComponent],
})
export class TypeLocaliteModule {}
