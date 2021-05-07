import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user_id:string;

  constructor(private deviceService: DeviceDetectorService) {
    this.user_id = `BrandonAngular${this.deviceService.os}${this.deviceService.browser}` 
  }

  getUserId() {
    return this.user_id;
  }
}
