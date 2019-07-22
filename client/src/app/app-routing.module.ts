import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { EntityResolverService } from './services/entity-resolver.service';

const routes: Routes = [
  { 
    path: 'edit/:id',
    component: EditComponent,
    resolve: {
      entity: EntityResolverService
    }
  },
  { path: 'list', component: ListComponent },
  { path: '', redirectTo: '/list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
