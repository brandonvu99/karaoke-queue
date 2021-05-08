import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user_id:string;

  constructor(private deviceService: DeviceDetectorService, private cookieService: CookieService) {
    this.user_id = this.cookieService.get("username");
    if (this.user_id === "") this.user_id = "Default User";
    console.log(`Username is: ${this.user_id}`)
  }

  setUserId(user_id:string) {
    this.user_id = user_id;
    if (this.user_id === "") this.user_id = "Default User";
    this.cookieService.set("username", user_id)
  }

  getUserId() {
    return this.user_id;
  }
}
