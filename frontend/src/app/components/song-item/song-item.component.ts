import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Song } from 'src/app/models/Song'
import { SongService } from 'src/app/services/song.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import { Subscription, timer } from 'rxjs';
import 'moment-duration-format';
import { UserService } from 'src/app/services/user.service';

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
  @Input() songWaitTimeMs!:number;
  @Output() deleteSong:EventEmitter<Song> = new EventEmitter();

  imageToShow:any;

  timeSinceCreated:string|null = null;
  timeSinceCreatedSubscription:Subscription|null = null;
  songWaitTimeReadable:string|null = null;
  // songWaitTime:string|null = null;
  // songWaitTimeSubscription:Subscription|null = null;

  constructor(private songService:SongService, private http:HttpClient, private userService:UserService) {
  }

  ngOnInit(): void { 
    // display the album art, and only pull the image again if it disappeared (somehow, not sure a scenario when that would be)
    this.imageToShow = this.songService.getImage(this.song.id)
    if (!this.imageToShow && this.song.image_url) {
      this.http.get(this.song.image_url, httpOptions).subscribe(data => {
          console.log('pinged spotify for album cover')
          let reader = new FileReader(); //you need file reader for read blob data to base64 image data.
          reader.addEventListener("load", () => {
              this.imageToShow = reader.result; // here is the result you got from reader
              this.songService.addImage(this.song.id, this.imageToShow);
          }, false);

          if (data) {
              reader.readAsDataURL(data);
          }
      }, error => {
        console.log(`Error occured while downloading image from this url: ${this.song.image_url}`, error);
      });
    }

    // display the duration of the song
    let song_duration_as_moment = moment.duration(this.song.duration_ms, 'ms')
    this.song.duration_readable = `${song_duration_as_moment.minutes().toString().padStart(2, '0')}:${song_duration_as_moment.seconds().toString().padStart(2, '0')}`;
    
    // display the time since the song was created
    this.timeSinceCreatedSubscription = timer(0, 1000).subscribe( _ => {
      this.timeSinceCreated = moment(this.song.date_created).fromNow()
    })

    let songWaitTimeMsDuration = moment.duration(this.songWaitTimeMs, 'ms')
    // this.songWaitTimeReadable = `${songWaitTimeMsDuration.asHours() > 0 ? songWaitTimeMsDuration.hours().toString().padStart(2, '0') + ":" : ""}${songWaitTimeMsDuration.minutes().toString().padStart(2, '0')}:${songWaitTimeMsDuration.seconds().toString().padStart(2, '0')}`
    this.songWaitTimeReadable = songWaitTimeMsDuration.format("HH:mm:ss", {trim: false})

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

  ngOnDestory(): void {
    this.timeSinceCreatedSubscription?.unsubscribe()
    // this.songWaitTimeSubscription?.unsubscribe()
  }

  doesRequesterIdMatchUserId() {
    return (this.song.requester_id === this.userService.getUserId())
      || ("Brandon" === this.userService.getUserId());
  }

  onDelete(song:Song) {
    if(confirm(`Are you sure you want to delete "${song.song_name}" by ${song.artist}?`)) {
      if(confirm(`Are you REALLY DOUBLE DOG sure you want to delete "${song.song_name}" by ${song.artist}?`)) {
        if(confirm(`You CANNOT undo this delete on "${song.song_name}" by ${song.artist}!!`)) {
          this.deleteSong.emit(song);
        }
      }
    }
  }
}