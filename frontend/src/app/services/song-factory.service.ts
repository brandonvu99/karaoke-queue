import { Injectable } from '@angular/core';
import { Song } from '../models/Song';
import { SpotifyService } from './spotify.service';
import * as moment from 'moment';

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
      songName: songName,
      timeAdded: moment("2021-05-03T12:00:00"),
      upvotes: 5
    }
    return newSong
  }
}
