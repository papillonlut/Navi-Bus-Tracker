import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { TrackerComponent } from './tracker/tracker.component';
import { ActualiteComponent } from './actualite/actualite.component';
import { ErrorComponent } from './error/error.component';


export const routes: Routes = [
  { path: '', component: AcceuilComponent },
  { path: 'acceuil', component: AcceuilComponent },
  { path: 'tracker', component: TrackerComponent },
  { path: 'actu', component: ActualiteComponent },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}