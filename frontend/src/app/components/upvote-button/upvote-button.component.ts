import { Component, OnInit, Input } from '@angular/core';
import { Song } from 'src/app/models/Song'
import { Subscription } from 'rxjs';
import { SongService } from 'src/app/services/song.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-upvote-button',
  templateUrl: './upvote-button.component.html',
  styleUrls: ['./upvote-button.component.css']
})
export class UpvoteButtonComponent implements OnInit {

  @Input() song!:Song;

  userCanVote:boolean = true;

  subscription?:Subscription;

  constructor(private songService:SongService, private userService:UserService) { }

  ngOnInit() {
    // this.subscription = this.upvoteService.getItemVotes(this.itemId).subscribe(upvotes => {
    //                     if (this.userId) this.userVote = upvotes[this.userId]
    //                     this.voteCount = sum(values(upvotes))
    //                   })
    this.userCanVote = !this.song.upvotes.includes(this.userService.getUserId())
  }

  upvote() {

    // TODO: Update in UI?

    // Update in server
    console.log(`sending upvote: ${this.userCanVote}`)
    this.songService.updateUserVoteOnSong(this.song.id, this.userCanVote)

    // update the user's status
    this.userCanVote = !this.userCanVote;
  }

  setClasses() {
    let classes = {
      "active": this.userCanVote,
      "inactive": !this.userCanVote
    }
    return classes
  }

}
