import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { SongFactoryService } from 'src/app/services/song-factory.service';
import { Song } from '../../models/Song'
import { SongService } from '../../services/song.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  responseType: 'blob' as 'blob',
}

@Component({
  selector: 'app-song-item',
  templateUrl: './song-item.component.html',
  styleUrls: ['./song-item.component.css']
})
export class SongItemComponent implements OnInit {

  @Input() song!:Song;
  @Output() deleteSong:EventEmitter<Song> = new EventEmitter();

  imageToShow:any;

  constructor(private songService:SongService, private songFactory:SongFactoryService, private http:HttpClient) {
  }

  ngOnInit(): void {
    this.http.get("https://i.scdn.co/image/ab67616d00001e022c5b24ecfa39523a75c993c4", httpOptions).subscribe(data => {
        let reader = new FileReader(); //you need file reader for read blob data to base64 image data.
        reader.addEventListener("load", () => {
            this.imageToShow = reader.result; // here is the result you got from reader
        }, false);

        if (data) {
            reader.readAsDataURL(data);
        }
        console.log(`nice ${data}`)
    }, error => {
      console.log("Error occured",error);
    });
    console.log(this.song);
  }

  setClasses() {
    let classes = {
      "song-item": true
    }
    return classes
  }

  onDelete(song:Song) {
    this.deleteSong.emit(song);
  }
}
