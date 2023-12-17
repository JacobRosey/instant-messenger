import { Component, OnInit } from '@angular/core';
import { UserData, Message } from '../userdata.interface';
import { FirebaseService } from 'src/app/firebase.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {

  userData: UserData = {name: '', friends: [], messages: [] };
  isLoading: boolean = true;
  unreadMessages : number  = 0;
  hasUnreadMessages: boolean = false;
  hasMessages: boolean = false;
  friendsList: Array<string> = []

  constructor(private fs: FirebaseService) {}

  async ngOnInit() {
    await this.getStoredUserData();
    await this.setTemplateValues()
    console.log(this.userData.messages)
    await this.sortMsgTimestamps()
  }

  async getStoredUserData(){
    try{
      this.userData = await this.fs.getStoredUserData();
    } catch(err){console.error(err)} finally {
      this.isLoading = false;
    };
  }

  async setTemplateValues(){
    //Sort messages by sender then by timestamp
    //Also need to show messages sent by the user that's logged in
    this.unreadMessages = this.userData.messages.filter(message => !message.isRead).length;
    this.hasMessages = this.userData.messages ? true : false;
    this.hasUnreadMessages = this.unreadMessages ? true : false;
    this.userData.name = this.userData.name.charAt(0).toUpperCase() + this.userData.name.slice(1);
  }

  //send message to user here
  async sendMessage(){
    
  }
  //Add way to show the year if the message is > 1 year old
  async sortMsgTimestamps(){
    this.userData.messages.forEach(msg => {
      msg.sender = msg.sender.charAt(0).toUpperCase() + msg.sender.slice(1);
      msg.timestamp = new Date(msg.timestamp.seconds * 1000)
    });
    //Add collapsible button to show/hide messages from friend
    //Sort by messages to and from the same users, then by time sent
    // Sort by sender, recipient, and then timestamp
    this.userData.messages.sort((a, b) => {
      // Compare senders and recipients
      const senderComparison = a.sender.localeCompare(b.sender);
      const recipientComparison = a.recipient.localeCompare(b.recipient);

      // If senders and recipients are the same, compare timestamps
      if (senderComparison === 0 && recipientComparison === 0) {
        return a.timestamp.getTime() - b.timestamp.getTime();
      }

      // Otherwise, sort by sender and recipient
      if (senderComparison !== 0) {
        return senderComparison;
      }

      return recipientComparison;
    });
  }

  async onLogout(){
    await this.fs.deleteStoredUserData();
  }
}
