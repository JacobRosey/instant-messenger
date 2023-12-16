import { Component, OnInit } from '@angular/core';
import { UserData } from './userdata.interface';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  userData: UserData = {name: '', friends: 0, messages: 0 };
  isLoading: boolean = true;
  hasMessages: boolean = false;

  constructor(private fs: FirebaseService) {}

  ngOnInit() {
    this.getStoredUserData();
  }

  async getStoredUserData(){
    try{
      this.userData = await this.fs.getStoredUserData();
    } catch(err){console.error(err)} finally {
      this.isLoading = false;
    };
    //Need to check for unread messages here, not just all messages. Toggles red 
    //tag showing new messages by inbox link
    this.hasMessages = this.userData.messages > 0 ? true : false;
    this.userData.name = this.userData.name.charAt(0).toUpperCase() + this.userData.name.slice(1)
  }
  async onLogout(){
    await this.fs.resetStoredUserData();
  }
}
