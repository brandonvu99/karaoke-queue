import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-song',
  templateUrl: './add-song.component.html',
  styleUrls: ['./add-song.component.css']
})
export class AddSongComponent implements OnInit {

  @Output() addSong: EventEmitter<any> = new EventEmitter;

  artist:string|null = null;
  songName:string|null = null;

  constructor() {
  }

  ngOnInit(): void {
  }

  onSubmit() {
    const song = {
      artist: this.artist,
      songName: this.songName
    }

    this.addSong.emit(song);
  }

}
