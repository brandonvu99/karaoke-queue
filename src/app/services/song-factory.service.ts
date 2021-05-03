import { Injectable } from '@angular/core';
import { Song } from '../models/Song';
import { SpotifyService } from './spotify.service';

const httpOptions = {
  responseType: 'blob' as 'blob',
}


@Injectable({
  providedIn: 'root'
})
export class SongFactoryService {

  constructor(private spotify:SpotifyService) { }

  createNewSongObject(artist:string, songName:string):Song {
    
    let newSong:Song = {
      artist: artist,
      songName: songName
    }

    this.spotify.getSongImageUrlAndDuration(`${artist} ${songName}`)
    .then(observable => { observable.subscribe( data => {
      newSong.imageUrl = data.tracks.items[0].album.images[1].url
      newSong.duration = data.tracks.items[0].duration_ms.toString()
    })})
    return newSong
  }
}
