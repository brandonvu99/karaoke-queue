import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.css']
})
export class UsernameComponent implements OnInit {

  username:string;

  constructor(private userService:UserService) { 
    this.username = this.userService.getUserId()
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.username = this.userService.setUserId(this.username);
  }
}
