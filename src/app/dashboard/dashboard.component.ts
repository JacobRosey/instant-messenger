import { Component, HostListener, OnInit } from '@angular/core';
import { UserData } from './userdata.interface';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  userData: UserData = {name: '', friends: [], messages: [] };
  isLoading: boolean = true;
  unreadMessages : number  = 0;
  hasUnreadMessages: boolean = false;
  navDropdownVisible: boolean = false;
  rememberNavDropdown: boolean = false;

  constructor(private fs: FirebaseService) {}

  ngOnInit() {
    this.getStoredUserData();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkWindowWidth();
  }

  // Remembers if navbar was opened when window is resized, prevents both navbars from being open at once
  private checkWindowWidth(): void {
    const windowWidth = window.innerWidth;

    if (windowWidth >= 1024) {
      // Execute your function here
      if(this.navDropdownVisible){
        this.toggleNavDropdown()
        this.rememberNavDropdown = true;
      }
    } else if(this.rememberNavDropdown && windowWidth < 1024){
      this.toggleNavDropdown();
      this.rememberNavDropdown = !this.rememberNavDropdown
    }
  }

  toggleNavDropdown(){
    this.navDropdownVisible = !this.navDropdownVisible
  }

  async getStoredUserData(){
    try{
      this.userData = await this.fs.getStoredUserData();
    } catch(err){console.error(err)} finally {
      this.isLoading = false;
    };
    //Toggles red tag showing how many unread messages the user has. 
    //need to subscribe to userData (or something idk) to update this count
    //as messages get read
    this.unreadMessages = this.userData.messages.filter(message => !message.isRead && 
      (message.sender.toLowerCase() !== this.userData.name.toLowerCase())).length;
    this.hasUnreadMessages = this.unreadMessages ? true : false;
    this.userData.name = this.userData.name.charAt(0).toUpperCase() + this.userData.name.slice(1)
  }
  async onLogout(){
    await this.fs.deleteStoredUserData();
  }
}
