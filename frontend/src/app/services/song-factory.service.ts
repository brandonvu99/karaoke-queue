import { Injectable } from '@angular/core';
import { Song } from '../models/Song';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

const httpOptions = {
  responseType: 'blob' as 'blob',
}


@Injectable({
  providedIn: 'root'
})
export class SongFactoryService {

  constructor() { }

  createNewSongObject(artist:string, songName:string):Song {
    
    let newSong:Song = {
      song_queue_id: "1",
      id: uuidv4(),
      user_id: "Brandon Vu",
      date_created: moment("2021-05-03T12:00:00"),
      artist: artist,
      song_name: songName,
      upvotes: 0
    }
    return newSong
  }
}
