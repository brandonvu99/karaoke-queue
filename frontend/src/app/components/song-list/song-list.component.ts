import { Component, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { Song } from '../../models/Song'
import { SongService } from '../../services/song.service'

@Component({
  selector: 'app-songs',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit {

  songs:Song[] = [];
  bufferAddSongs:Song[] = [];
  bufferDeleteSongs:Song[] = [];

  private refreshSubscription:Subscription;

  constructor(private songService:SongService) {
    this.refreshSubscription = new Subscription();
  }

  ngOnInit(): void {
    this.refreshSubscription = timer(1000, 15000).subscribe( _ => {
      console.log('refreshing songs')
      this.refresh()
    })
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
    })
  }

  deleteSong(songToDelete: Song) {
    // remove song from local storage
    this.songs = this.songs.filter(song => song.id !== songToDelete.id)

    // remove song from database
    this.bufferDeleteSongs.push(songToDelete)
    this.songService.deleteSong(songToDelete)
  }

  addSong(song: Song) {
    // Add to UI
    this.songs.push(song);
    // Add to server
    this.songService.addSong(song);
  }
}
