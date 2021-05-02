import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SongsComponent } from './components/songs/songs.component'
import { AboutComponent } from './components/pages/about/about.component'

const routes: Routes = [
  { path:'', component:SongsComponent },
  { path:'about', component:AboutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
