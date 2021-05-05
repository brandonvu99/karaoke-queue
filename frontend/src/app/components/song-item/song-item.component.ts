import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Song } from '../../models/Song'
import { SongService } from '../../services/song.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import { Subscription, timer } from 'rxjs';
import 'moment-duration-format';

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

  timeSinceCreated:string|null = null;
  timeSinceCreatedSubscription:Subscription|null = null;
  songWaitTime:string|null = null;
  songWaitTimeSubscription:Subscription|null = null;

  constructor(private songService:SongService, private http:HttpClient) {
  }

  ngOnInit(): void {
    console.log(this.song)
    
    // display the album art
    if (this.song.image_url) {
      this.http.get(this.song.image_url, httpOptions).subscribe(data => {
          let reader = new FileReader(); //you need file reader for read blob data to base64 image data.
          reader.addEventListener("load", () => {
              this.imageToShow = reader.result; // here is the result you got from reader
          }, false);

          if (data) {
              reader.readAsDataURL(data);
          }
      }, error => {
        console.log(`Error occured while downloading image from this url: ${this.song.image_url}`, error);
      });
    }

    // display the duration of the song
    let song_duration_as_moment = moment.duration(this.song.duration, 'ms')
    this.song.duration_readable = `${song_duration_as_moment.minutes().toString().padStart(2, '0')}:${song_duration_as_moment.seconds().toString().padStart(2, '0')}`;
    
    // display the time since the song was created
    this.timeSinceCreatedSubscription = timer(0, 1000).subscribe( _ => {
      this.timeSinceCreated = moment(this.song.date_created).fromNow()
    })

    // // display the time until the song is played
    // this.waitTimeSubscription = timer(1000, 6000).subscribe( _ => {
    //   let cumulativeTimeInMs:number = 0;
    //   this.allSongs.forEach( (otherSong, index) => {
    //     if (index < this.indexInAllSongs) {
    //       cumulativeTimeInMs += otherSong.duration!.asMilliseconds()
    //     }
    //   })
    //   let cumulativeTimeInMsDuration = moment.duration(cumulativeTimeInMs, 'ms')
    //   // this.waitTime = `${cumulativeTimeInMsDuration.asHours() > 0 ? cumulativeTimeInMsDuration.hours().toString().padStart(2, '0') + ":" : ""}${cumulativeTimeInMsDuration.minutes().toString().padStart(2, '0')}:${cumulativeTimeInMsDuration.seconds().toString().padStart(2, '0')}`
    //   this.waitTime = cumulativeTimeInMsDuration.format("HH:mm:ss", {trim: false})
    // })    
  }

  setClasses() {
    let classes = {
      "song-item": true
    }
    return classes
  }

  onDelete(song:Song) {
    this.timeSinceCreatedSubscription?.unsubscribe();
    this.songWaitTimeSubscription?.unsubscribe();
    this.deleteSong.emit(song);
  }
}
