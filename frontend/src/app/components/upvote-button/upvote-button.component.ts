import { Component, OnInit, Input } from '@angular/core';
import { Song } from '../../models/Song'
import { Subscription } from 'rxjs';
import { SongService } from 'src/app/services/song.service';

@Component({
  selector: 'app-upvote-button',
  templateUrl: './upvote-button.component.html',
  styleUrls: ['./upvote-button.component.css']
})
export class UpvoteButtonComponent implements OnInit {

  @Input() song!:Song;

  userVoted:boolean = false;

  subscription?:Subscription;

  constructor(private songService:SongService) { }

  ngOnInit() {
    // this.subscription = this.upvoteService.getItemVotes(this.itemId).subscribe(upvotes => {
    //                     if (this.userId) this.userVote = upvotes[this.userId]
    //                     this.voteCount = sum(values(upvotes))
    //                   })
  }

  upvote() {
    let adder = this.userVoted ? -1 : 1

    // Update in UI
    this.song.upvotes += adder

    // Update in server
    this.songService.updateUserVoteOnSong(this.song.id, adder)

    // update the user's status
    this.userVoted = !this.userVoted;
  }

  setClasses() {
    let classes = {
      "active": !this.userVoted,
      "inactive": this.userVoted
    }
    return classes
  }

}
