import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Song } from '../models/Song'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class SongService {

  todosUrl:string = "https://jsonplaceholder.typicode.com/todos";
  todosLimit:string = "?_limit=5";

  songs:Song[];
  header:boolean = true;

  constructor(private http:HttpClient) { 
    this.songs = [
      {
        artist: "RuPaul",
        songName: "New Friends Silver, Old Friends Gold",
        duration: "3:40"
      },
      {
        artist: "RuPaul/The Cast of RuPaul's Drag Race, Season 13",
        songName: "Lucky",
        duration: "3:44"
      }
    ]

  }

  getSongs():Observable<Song[]> {
    return new Observable(observer => {
      observer.next(this.songs)
    })
  }

  deleteSong(song: Song):Observable<Song> {
    this.songs = this.songs.filter(s => s.songName !== song.songName && s.artist !== song.artist);
    return new Observable(observer => {
      
    })
  }

  addSong(song: Song):Observable<Song> {
    return this.http.post<Song>(this.todosUrl, song, httpOptions)
  }
}
