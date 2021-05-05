import { Injectable } from '@angular/core';
import { Subscription, Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Song } from '../models/Song'

@Injectable({
  providedIn: 'root'
})
export class SongService {

  songs:Song[] = [];
  header:boolean = true;

  backendApiUrl:string = "http://127.0.0.1:5000"

  constructor(private http:HttpClient) { 
    let mockSongs = [
      {
        artist: "RuPaul",
        songName: "New Friends Silver, Old Friends Gold",
        duration: "3:40"
      },
      {
        artist: "Lady Gaga",
        songName: "Bad Romance",
        duration: "4:55"
      },
      {
        artist: "Gym Class Heroes",
        songName: "Ass Back Home (feat. Neon Hitch)",
        duration: "3:42"
      },
      {
        artist: "Lady Gaga",
        songName: "Judas",
        duration: "4:09"
      },
      {
        artist: "Paramore",
        songName: "Still Into You",
        duration: "3:36"
      },
    ]
  }

  getSongs():Observable<Song[]> {
    return this.http.get<Song[]>(`${this.backendApiUrl}/api/song_queues/1/songs`)
      .pipe(retry(1),
        catchError(this.handleError));
  }

  deleteSong(song: Song):Subscription {
    return this.http.delete<Song>(`${this.backendApiUrl}/api/song_queues/1/songs/${song.id}`)
      .pipe(retry(1),
        catchError(this.handleError))
      .subscribe();
  }

  addSong(song: Song):Observable<Song> {
    this.songs.push(song)
    return new Observable(observer => {
      
    })
  }

  updateUserVote(songIndex:number, userId:number, vote:number) {
    this.songs[songIndex].upvotes! += vote;
  }

  handleError(error: HttpErrorResponse) {
    console.log("Caught an error!")
    return throwError(error);
  }
}
