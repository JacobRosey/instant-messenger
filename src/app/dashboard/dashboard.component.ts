import { Component, OnInit } from '@angular/core';
import { UserDataService } from './user.data.service';
import { UserData } from './userdata.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  userData: UserData = {name: '', friends: 0, messages: 0 };
  hasMessages: boolean = false;
  isLoading: boolean = true;

  constructor(private uds: UserDataService) { }

  ngOnInit() {
    this.getUserData();
  }

  async getUserData(){
    try{
      this.userData = await this.uds.getUserData();
    } catch(err){console.error(err)} finally {
      this.isLoading = false;
    };
    //Need to check for unread messages here, not just all messages. Toggles red 
    //tag showing new messages by inbox link
    this.hasMessages = this.userData.messages > 0 ? true : false;
  }
}
