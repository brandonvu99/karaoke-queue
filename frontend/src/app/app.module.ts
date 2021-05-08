import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'
import { NgxCsvParserModule } from 'ngx-csv-parser';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SongListComponent } from './components/song-list/song-list.component';
import { SongItemComponent } from './components/song-item/song-item.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { AddSongComponent } from './components/add-song/add-song.component';
import { AboutComponent } from './components/pages/about/about.component';
import { UpvoteButtonComponent } from './components/upvote-button/upvote-button.component';
import { UsernameComponent } from './components/username/username.component';

import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    SongListComponent,
    SongItemComponent,
    HeaderComponent,
    AddSongComponent,
    AboutComponent,
    UpvoteButtonComponent,
    UsernameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxCsvParserModule,
    ScrollingModule
  ],
  providers: [
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
