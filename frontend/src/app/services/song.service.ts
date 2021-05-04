import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Song } from '../models/Song'
import { SongFactoryService } from './song-factory.service'

@Injectable({
  providedIn: 'root'
})
export class SongService {

  todosUrl:string = "https://jsonplaceholder.typicode.com/todos";
  todosLimit:string = "?_limit=5";

  songs:Song[];
  header:boolean = true;

  constructor(private http:HttpClient, private songFactory:SongFactoryService) { 
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

    this.songs = []
    mockSongs.forEach(mockSong => {
      this.songs.push(songFactory.createNewSongObject(mockSong.artist, mockSong.songName))
    });

  }

  getSongs():Observable<Song[]> {
    const myClonedArray:Song[] = [];
    this.songs.forEach(val => myClonedArray.push(Object.assign({}, val)));
    return new Observable(observer => {
      observer.next(myClonedArray)
    })
  }

  deleteSong(song: Song):Observable<Song> {
    this.songs = this.songs.filter(s => (s.songName !== song.songName) && (s.artist !== song.artist));
    return new Observable(observer => {
      
    })
  }

  addSong(song: Song):Observable<Song> {
    this.songs.push(song)
    return new Observable(observer => {
      
    })
  }

  updateUserVote(songIndex:number, userId:number, vote:number) {
    this.songs[songIndex].upvotes! += vote;
  }
}
