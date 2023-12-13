import { Component, OnInit } from '@angular/core';
import { UserData } from '../userdata.interface';
import { FirebaseService } from 'src/app/firebase.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {

  userData: UserData = {name: '', friends: 0, messages: 0 };
  isLoading: boolean = true;
  hasMessages: boolean = false;

  constructor(private fs: FirebaseService) {}

  ngOnInit() {
    this.getUserData();
  }

  async getUserData(){
    try{
      this.userData = await this.fs.getStoredUserData();
    } catch(err){console.error(err)} finally {
      this.isLoading = false;
    };
    //Need to check for unread messages here, not just all messages. Toggles red 
    //tag showing new messages by inbox link
    this.hasMessages = this.userData.messages > 0 ? true : false;
  }
}
