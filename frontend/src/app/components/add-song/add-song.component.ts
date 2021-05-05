import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-song',
  templateUrl: './add-song.component.html',
  styleUrls: ['./add-song.component.css']
})
export class AddSongComponent implements OnInit {

  @Output() addSong: EventEmitter<any> = new EventEmitter;

  artist:string|null = null;
  song_name:string|null = null;

  constructor() {
  }

  ngOnInit(): void {
  }

  onSubmit() {
    const song_info = {
      artist: this.artist,
      song_name: this.song_name
    }

    this.addSong.emit(song_info);
  }

}
