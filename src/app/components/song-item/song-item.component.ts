import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Song } from '../../models/Song'
import { SongService } from '../../services/song.service';

@Component({
  selector: 'app-song-item',
  templateUrl: './song-item.component.html',
  styleUrls: ['./song-item.component.css']
})
export class SongItemComponent implements OnInit {

  @Input() song:Song;
  @Output() deleteSong:EventEmitter<Song> = new EventEmitter();

  constructor(private songService:SongService) { 
    this.song = {
      artist: "N/A",
      songName: "N/A",
      duration: "N/A"
    }
  }

  ngOnInit(): void {
  }

  setClasses() {
    let classes = {
      song: true
    }
    return classes
  }

  onDelete(song:Song) {
    this.deleteSong.emit(song);
  }
}
