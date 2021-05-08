import { Component, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { Song } from '../../models/Song'
import { SongService } from '../../services/song.service'
import { v4 as uuid4 } from 'uuid';
import * as moment from 'moment';
import { UserService } from '../../services/user.service'

// TODO: sort the song list in real time (backend already does this, just find a way to reorder the list without losing the trackBy fix for the flickering)
// https://stackoverflow.com/questions/48418019/sorting-an-ngfor-array-with-trackby-in-angular-4

@Component({
  selector: 'app-songs',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit {

  songs:Song[] = [];
  songsDuration:number[] = [];
  bufferAddSongs:Song[] = [];
  bufferDeleteSongs:Song[] = [];

  private refreshSubscription:Subscription;

  constructor(private songService:SongService, private userService:UserService) {
    this.refreshSubscription = new Subscription();
  }

  ngOnInit(): void {
    this.refreshSubscription = timer(0, 1000).subscribe( _ => {
      console.log('refreshing songs')
      this.refresh()
    })
  }

  ngOnDestory(): void {
    this.refreshSubscription.unsubscribe()
  }

  refresh(): void {
    // update list of songs
    this.songService.getSongs().subscribe( (refreshedSongs:Song[]) => {
      // update individual songs while also removing songs that were deleted in database
      this.songs = this.songs.map(oldSong => {
        let refreshedSongWithMatchingId = refreshedSongs.find(refreshedSong2 => refreshedSong2.id == oldSong.id)
        let bufferAddSongWithMatchingId = this.bufferAddSongs.find(bufferedAddSong => bufferedAddSong.id == oldSong.id)
        if (!refreshedSongWithMatchingId && !bufferAddSongWithMatchingId) {
          oldSong.id = "DELETE ME FLAG"
          return oldSong
        } 
        return refreshedSongWithMatchingId ? { ...oldSong, ...refreshedSongWithMatchingId } : refreshedSongWithMatchingId;
      }).filter( (song:Song|undefined):song is Song => song?.id != "DELETE ME FLAG")

      // add new songs to the songs array
      refreshedSongs.forEach( (refreshedSong:Song) => {
        // if the song is not already in the songs array (should only happen if this user created this song)
        // AND if the song isn't set to be deleted in the database,
        // then this is a new song, so add it to the song array
        let oldSongWithMatchingId = this.songs.find(oldSong2 => oldSong2.id == refreshedSong.id)
        let bufferDeleteSongWithMatchingId = this.bufferDeleteSongs.find(bufferedDeleteSong => bufferedDeleteSong.id == refreshedSong.id)
        if (!oldSongWithMatchingId && !bufferDeleteSongWithMatchingId) {
          this.songs.push(refreshedSong)
        }

        // remove songs from the add song buffer that are already in the database
        this.bufferAddSongs = this.bufferAddSongs.filter(bufferedAddSong => bufferedAddSong.id !== refreshedSong.id)
      })

      // remove songs from the delete song buffer that have already been deleted in the database
      this.bufferDeleteSongs = this.bufferDeleteSongs.filter(bufferDeleteSong => {
        return refreshedSongs.find(refreshedSong => refreshedSong.id === bufferDeleteSong.id) ? true : false
      })

      // update durations?
      let rollingSum:number = 0;
      this.songsDuration = this.songs.map(song => {
        let waitTimeForThisSong:number = rollingSum;
        rollingSum += song.duration_ms;
        return waitTimeForThisSong;
      })
    })
  }

  getWaitTime(index:number):number {
    return this.songsDuration[index];
  }

  addSong(song_info:any) {
    let songToAdd = {
      song_queue_id: "1",
      id: uuid4(),
      requester_id: this.userService.getUserId(),
      date_created: moment(),
      artist: song_info.artist,
      song_name: song_info.song_name,
      duration_ms: 0,
      upvotes: []
    }
    
    // add song to local storage
    this.songs.push(songToAdd);

    // add song to database
    this.songService.addSong(songToAdd);
  }

  deleteSong(songToDelete: Song) {
    // remove song from local storage
    this.songs = this.songs.filter(song => song.id !== songToDelete.id)

    // remove song from database
    this.bufferDeleteSongs.push(songToDelete)
    this.songService.deleteSong(songToDelete)
  }

  trackSong(index:number, song:Song) {
    // return song ? song.id : null
    return song ? index + song.id + this.songs?.length : null
  }
}
