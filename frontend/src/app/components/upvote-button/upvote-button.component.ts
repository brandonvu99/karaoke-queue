import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { SongService } from 'src/app/services/song.service';

@Component({
  selector: 'app-upvote-button',
  templateUrl: './upvote-button.component.html',
  styleUrls: ['./upvote-button.component.css']
})
export class UpvoteButtonComponent implements OnInit {

  // @Input() songIndex;

  voteCount:number = 0;
  userVoted:boolean = false;

  subscription?:Subscription;

  constructor(songService:SongService) { }

  ngOnInit() {
    // this.subscription = this.upvoteService.getItemVotes(this.itemId).subscribe(upvotes => {
    //                     if (this.userId) this.userVote = upvotes[this.userId]
    //                     this.voteCount = sum(values(upvotes))
    //                   })
  }

  upvote() {
    // Update in UI
    if (this.userVoted) {
      this.voteCount--;
    } else {
      this.voteCount++;
    }



    this.userVoted = !this.userVoted;

    // Update in server
    // this.songService.updateUserVote(this.itemId, this.userId, vote)
  }

  setClasses() {
    let classes = {
      "active": !this.userVoted,
      "inactive": this.userVoted
    }
    return classes
  }

}
