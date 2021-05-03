import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { SongFactoryService } from 'src/app/services/song-factory.service';
import { Song } from '../../models/Song'
import { SongService } from '../../services/song.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SpotifyService } from 'src/app/services/spotify.service';
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
  @Input() allSongs!:Song[];
  @Input() indexInAllSongs!:number;
  @Output() deleteSong:EventEmitter<Song> = new EventEmitter();

  imageToShow:any;

  timeSinceAdded:string|null = null;
  timeSinceAddedSubscription:Subscription|null = null;
  waitTime:string|null = null;
  waitTimeSubscription:Subscription|null = null;

  constructor(private songService:SongService, private songFactory:SongFactoryService, private http:HttpClient, private spotify:SpotifyService) {
  }

  ngOnInit(): void {
    this.spotify.getSongImageUrlAndDuration(`${this.song.artist} ${this.song.songName}`)
    .then(observable => { observable.subscribe( data => {
      this.song.imageUrl = data.tracks.items[0].album.images[2].url
      this.song.duration = moment.duration(data.tracks.items[0].duration_ms, 'ms')
      this.song.duration_readable = `${this.song.duration.minutes().toString().padStart(2, '0')}:${this.song.duration.seconds().toString().padStart(2, '0')}`;

      let delay = 0;
      let intervalInMs = 1000;
      this.timeSinceAddedSubscription = timer(delay, intervalInMs).subscribe( _ => {
        // console.log('test')
        this.timeSinceAdded = moment(this.song.timeAdded).fromNow()
      })

      this.waitTimeSubscription = timer(0, 10000).subscribe( _ => {
        let cumulativeTimeInMs:number = 0;
        this.allSongs.forEach( (otherSong, index) => {
          if (index < this.indexInAllSongs) {
            cumulativeTimeInMs += otherSong.duration!.asMilliseconds()
          }
        })
        let cumulativeTimeInMsDuration = moment.duration(cumulativeTimeInMs, 'ms')
        // this.waitTime = `${cumulativeTimeInMsDuration.asHours() > 0 ? cumulativeTimeInMsDuration.hours().toString().padStart(2, '0') + ":" : ""}${cumulativeTimeInMsDuration.minutes().toString().padStart(2, '0')}:${cumulativeTimeInMsDuration.seconds().toString().padStart(2, '0')}`
        this.waitTime = cumulativeTimeInMsDuration.format("HH:mm:ss", {trim: false})
      })
      
      this.http.get(this.song.imageUrl, httpOptions).subscribe(data => {
          let reader = new FileReader(); //you need file reader for read blob data to base64 image data.
          reader.addEventListener("load", () => {
              this.imageToShow = reader.result; // here is the result you got from reader
          }, false);
  
          if (data) {
              reader.readAsDataURL(data);
          }
      }, error => {
        console.log("Error occured", error);
      });
    })})
  }

  setClasses() {
    let classes = {
      "song-item": true
    }
    return classes
  }

  onDelete(song:Song) {
    this.timeSinceAddedSubscription?.unsubscribe();
    this.waitTimeSubscription?.unsubscribe();
    this.deleteSong.emit(song);
  }
}
