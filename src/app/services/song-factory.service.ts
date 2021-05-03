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
    .then(value => {
      console.log(`value ${value}`)
      newSong.imageUrl = value[0]
      newSong.duration = value[1].toString()
    })
    // .catch(err => {
    //   console.error(`error from me hehe: ${err}`)});
    return newSong
  }
}
