import { Component, OnInit } from '@angular/core';
import { Song } from '../../models/Song'
import { SongService } from '../../services/song.service'

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css']
})
export class SongsComponent implements OnInit {

  songs:Song[];

  constructor(private songService:SongService) { 
    this.songs = [];
    this.songService.getSongs().subscribe( songs => {
      this.songs = songs;
    });
  }

  ngOnInit(): void {
  }

  deleteSong(song: Song) {
    // Remove from UI
    this.songs = this.songs.filter(s => s.songName !== song.songName && s.artist !== song.artist);
    // Remove from server
    this.songService.deleteSong(song);
  }

  addSong(song: Song) {
    this.songService.addSong(song).subscribe(song => {
      this.songs.push(song);
    });
  }
}
