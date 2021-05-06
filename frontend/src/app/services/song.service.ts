import { Injectable } from '@angular/core';
import { Subscription, Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Song } from '../models/Song'

const httpOptions = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
  }
}

@Injectable({
  providedIn: 'root'
})
export class SongService {

  songs:Song[] = [];
  header:boolean = true;

  song_id_to_image: Map<string, any> = new Map()

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
      .pipe(
        map((songs:Song[]) => songs.map((song_info) => new Song(
          song_info['song_queue_id'],
          song_info['id'],
          song_info['user_id'],
          song_info['date_created'],
          song_info['artist'],
          song_info['song_name'],
          Number(song_info['duration_ms']),
          song_info['upvotes'],
          String(song_info['image_url'])
        ))),
        retry(1),
        catchError(this.handleError)
    );
  }

  deleteSong(song: Song):Subscription {
    return this.http.delete<Song>(`${this.backendApiUrl}/api/song_queues/1/songs/${song.id}`)
      .pipe(retry(1),
        catchError(this.handleError))
      .subscribe();
  }

  addSong(song: Song):Subscription {
    return this.http.post<Song>(`${this.backendApiUrl}/api/song_queues/1/songs`, song)
      .pipe(retry(1),
        catchError(this.handleError))
      .subscribe();
  }

  updateUserVoteOnSong(songId:string, is_upvote:boolean):Subscription {
    return this.http.post<any>(`${this.backendApiUrl}/api/song_queues/1/songs/${songId}/upvote`, 
      {
        "user_id" : "Brandon Vu",
        "is_upvote": is_upvote
      }
    ).pipe(retry(1),
        catchError(this.handleError))
      .subscribe();
  }

  handleError(error: HttpErrorResponse) {
    console.log("Caught an error!")
    return throwError(error);
  }

  addImage(id:string, image:any) {
    this.song_id_to_image.set(id, image);
  }

  getImage(id:string): any {
    return this.song_id_to_image.get(id);
  }

  deleteImage(id:string) {
    this.song_id_to_image.delete(id);
  }
}
