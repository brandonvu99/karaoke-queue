import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SongListComponent } from './components/song-list/song-list.component'
import { AboutComponent } from './components/pages/about/about.component'

const routes: Routes = [
  { path:'', component:SongListComponent },
  { path:'about', component:AboutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
