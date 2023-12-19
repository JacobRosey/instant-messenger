import { Component, OnInit } from '@angular/core';
import { UserData, Message } from '../userdata.interface';
import { FirebaseService } from 'src/app/firebase.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})

export class InboxComponent implements OnInit {

  //messages: Array<Message> = []; to avoid using this.userData.messages everywhere
  //Will have to subscribe to messages to see changes though
  userData: UserData = { name: '', friends: [], messages: [] };
  isLoading: boolean = true;
  unreadMessages: number = 0;
  hasUnreadMessages: boolean = false;
  hasMessages: boolean = false;
  //friendsList: Array<string> = []; currently not in use
  groupedMessages: Message[][] = [];
  commentDropdownStates: boolean[][] = [];
  replyTexts: Array<string> = [];
  

  constructor(private fs: FirebaseService) { }

  async ngOnInit() {
    //this.messages = this.userData.messages 
    await this.getStoredUserData();
    await this.setTemplateValues();
    await this.sortMessages();
    await this.groupMessages();
  }

  async getStoredUserData() {
    try {
      this.userData = await this.fs.getStoredUserData();
    } catch (err) { console.error(err) } finally {
      this.isLoading = false;
    };
  }

  async setTemplateValues() {
    this.unreadMessages = this.userData.messages.filter(message => (!message.isRead) && 
      message.recipient.toLowerCase() == this.userData.name.toLowerCase()).length;
    this.hasMessages = this.userData.messages ? true : false;
    this.hasUnreadMessages = this.unreadMessages ? true : false;
    this.userData.name = this.userData.name.charAt(0).toUpperCase() + this.userData.name.slice(1);
  }

  //Sort messages, capitalize first letter of username for rendering to html
  async sortMessages() {
    this.userData.messages.forEach(msg => {
      msg.timestamp = new Date(msg.timestamp.seconds * 1000)
      msg.sender = msg.sender.charAt(0).toUpperCase() + msg.sender.slice(1)
      msg.recipient = msg.recipient.charAt(0).toUpperCase() + msg.recipient.slice(1)
    })

    //Sort by messages to and from the same 2 users, then by time sent
    this.userData.messages.sort((a, b) => {
      // Compare senders and recipients
      const senderComparison = a.sender.localeCompare(b.sender);
      const recipientComparison = a.recipient.localeCompare(b.recipient);

      // If senders and recipients are the same, the message is between the same two users
      // so now compare timestamps
      if (senderComparison === 0 && recipientComparison === 0) {
        return a.timestamp.getTime() - b.timestamp.getTime();
      }

      // Otherwise, sort by sender and recipient
      if (senderComparison !== 0) {
        return senderComparison;
      }

      return recipientComparison;
    });
    this.userData.messages.forEach((msg) => {
      msg.timestamp = msg.timestamp.toLocaleString();
    })
  }

  async groupMessages() {
    //Now that array is sorted, push messages between the same 2 users to an array
    //and then use that array to render html so I can separate messages to different users
    let currentGroup: any[] = [];
    this.userData.messages.forEach((msg, index, array) => {
      if (index === 0) {
        // Start the first group
        currentGroup.push(msg);
      } else {
        const prevMsg = array[index - 1];
        // Check if the current message is between the same two users
        if (
          (msg.sender === prevMsg.sender && msg.recipient === prevMsg.recipient) ||
          (msg.sender === prevMsg.recipient && msg.recipient === prevMsg.sender)
        ) {
          // Add the message to the current group
          currentGroup.push(msg);
        } else {
          // Start a new group for a different pair of users
          this.groupedMessages.push([...currentGroup]);
          currentGroup = [msg];
        }
      }

      // Add the last group
      if (index === array.length - 1) {
        this.groupedMessages.push([...currentGroup]);
      }
    });
  }

   //send message to user here
   async sendMessage(i: number, j:number) {
    const text = this.replyTexts[i];
    const sender = this.userData.name;
    const recipient = this.groupedMessages[i][j].recipient == sender ? this.groupedMessages[i][j].sender : this.groupedMessages[i][j].recipient
    await this.fs.addMessage(sender.toLowerCase(), recipient.toLowerCase(), text)
   }

  toggleCommentDropdown(i: number, j: number){
    if (!this.commentDropdownStates[i]) {
      this.commentDropdownStates[i] = [];
    }
    this.commentDropdownStates[i][j] = !this.commentDropdownStates[i][j];
  }

  toggleConversationView(i: number, j:number){

  }

  async deleteComment(i: number, j: number){
    //lowkey need message id's for this
    //Add id to the Message interface and just use the auto-generated doc id from firebase
    console.log(`fixin to delete ${JSON.stringify(this.groupedMessages[i][j])}`)
  }

  async onLogout() {
    await this.fs.deleteStoredUserData();
  }
}
