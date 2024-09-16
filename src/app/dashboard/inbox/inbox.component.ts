import { Component, OnInit } from '@angular/core';
import { UserData, Message } from '../userdata.interface';
import { FirebaseService } from 'src/app/firebase.service';


@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})

export class InboxComponent implements OnInit {

  userData: UserData = { name: '', friends: [], messages: [], requests: [] };
  isLoading: boolean = true;
  unreadMessages: number = 0;
  hasUnreadMessages: boolean = false;
  hasMessages: boolean = false;
  groupedMessages: Message[][] = [];
  savedMsgState: Message[][] = []
  activeDropdown: {i: number; j:number} | null = null
  replyTexts: Array<string> = [];
  conversationsCollapsed: boolean[] = [];
  hasFriends: boolean = false;

  // For managing the edit state
  editing = false;
  editText: string = '';


  constructor(private fs: FirebaseService) { }

  async ngOnInit() {
    //this.messages = this.userData.messages 
    await this.getStoredUserData();
    await this.setTemplateValues();
    await this.sortMessages();
    await this.groupMessages();
    for (let i = 0; i < this.groupedMessages.length; i++) {
      this.conversationsCollapsed[i] = false;
    }
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
    this.hasMessages = this.userData.messages.length > 0 ? true : false;
    this.hasUnreadMessages = this.unreadMessages ? true : false;
    this.userData.name = this.userData.name.charAt(0).toUpperCase() + this.userData.name.slice(1);
    this.hasFriends = this.userData.friends.length > 0 ? true : false;
  }

  //Sort messages, capitalize first letter of username for rendering to html
  async sortMessages() {
    this.userData.messages.forEach(msg => {
      msg.timestamp = new Date(msg.timestamp.seconds * 1000)
      msg.sender = msg.sender.charAt(0).toUpperCase() + msg.sender.slice(1)
      msg.recipient = msg.recipient.charAt(0).toUpperCase() + msg.recipient.slice(1)
    })

    //Sort by messages to and from the same 2 users
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
    for (let i = 0; i < this.groupedMessages.length; i++) {
      this.groupedMessages[i].sort((a, b) => {
        return a.timestamp - b.timestamp
      })
      this.groupedMessages[i].forEach((msg) => {
        msg.timestamp = msg.timestamp.toLocaleString()
      })
    }
  }

  //send message to user here
  async sendMessage(i: number, j: number) {
    const text = this.replyTexts[i];
    const sender = this.userData.name;
    const recipient = this.groupedMessages[i][j].recipient == sender ? this.groupedMessages[i][j].sender : this.groupedMessages[i][j].recipient
    await this.fs.addMessage(sender.toLowerCase(), recipient.toLowerCase(), text)

    const thisVeryMoment = new Date();
    const msgID = localStorage.getItem('latestID') || '';
    const formattedDate = thisVeryMoment.toLocaleString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    })
    const newMsg: Message = {
      sender: sender,
      recipient: recipient,
      content: text,
      isRead: false,
      timestamp: formattedDate,
      id: msgID
    };

    // Push the new message to the groupedMessages array
    this.groupedMessages[i].push(newMsg);

    // Scroll to the bottom of the conversation or perform any UI update as needed
    this.scrollToReplyForm(i);

    // Clear the input field
    this.replyTexts[i] = '';
  }

  // Object to save index to edit and store the original text during editing
  editingIndex: { i: number, j: number } | null = null;
  originalContent: { i: number, j: number, content: string } | null = null; 

  isEditing(i: number, j: number): boolean {
    return this.editingIndex?.i === i && this.editingIndex?.j === j;
  }

  startEdit(i: number, j: number): void {
    const ogMessage = this.groupedMessages[i][j].content
    this.originalContent = {i: i, j: j, content: ogMessage};
    this.editingIndex = { i, j };
    this.closeDropdowns()
  }

  saveEdit(): void {
    // Here, the two-way binding will automatically update groupedMessages
    //TODO: update localstorage and post edited message to db
    this.exitEditMode();
  }

  cancelEdit(): void {
    if (this.editingIndex && this.originalContent !== null) {
      const { i, j } = this.editingIndex;
      this.groupedMessages[i][j].content = this.originalContent.content;
    }
    this.exitEditMode();
  }

  exitEditMode(): void {
    this.editingIndex = null;
    this.originalContent = null;
  }

  async deleteMessage(i: number ,j: number) {
    if (confirm('Are you sure you want to delete this message?')) {
      const id = this.groupedMessages[i][j].id;
      //delete comment of id from database, remove comment at i j from grouped messages arr
      alert(`Deleted message with id: ${id}`);

    } else {
      // Do nothing!
      console.log('Thing was not saved to the database.');
    } 
    this.closeDropdowns()
  }

  toggleCommentDropdown(i: number, j: number) {
    //cancel edit if edit was in progress
    if(this.editingIndex != null){
      this.cancelEdit()
    }
    // Check if the clicked dropdown is already active
    if (this.activeDropdown && this.activeDropdown.i === i && this.activeDropdown.j === j) {
      // If it is, close it
      this.activeDropdown = null;
    } else {
      // Otherwise, set the clicked dropdown as active
      this.activeDropdown = { i, j };
    }
  }

  isDropdownActive(i: number, j: number): boolean {
    return (this.activeDropdown != null) && (this.activeDropdown.i === i 
    && this.activeDropdown.j === j);
  }

  closeDropdowns(){
    this.activeDropdown = null
  }

  scrollToReplyForm(i: number) {
    const el = document.querySelectorAll('.replyForm')[i];
    el.scrollIntoView(true);
  }

  //Might just want to add isVisible property to message
  toggleConversationView(i: number) {
    this.conversationsCollapsed[i] = !this.conversationsCollapsed[i]
  }

  checkIsSender(i: number, j: number): boolean {
    return this.groupedMessages[i][j].sender == this.userData.name;
  }

  async onLogout() {
    await this.fs.deleteStoredUserData();
  }

  async addFriend(name: string) {
    if (this.userData.friends.includes(name)) {
      alert(`${name} is already on your friend's list`)
    }
    const userExists = await this.fs.doesUserExist(name);
    if (userExists) {
      if (this.userData.name.toLowerCase() == name) {
        alert("Did you really just try to add yourself as a friend?")
        return;
      }
      await this.fs.addFriend(this.userData.name.toLowerCase(), name)
    }
  }

  testMsg(f: Object) {
    console.log(f)
  }
}