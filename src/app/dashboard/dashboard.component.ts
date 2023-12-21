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

  constructor(private fs: FirebaseService) {}

  ngOnInit() {
    this.getStoredUserData();
  }

  async getStoredUserData(){
    try{
      this.userData = await this.fs.getStoredUserData();
    } catch(err){console.error(err)}
    this.userData.name = this.userData.name.charAt(0).toUpperCase() + this.userData.name.slice(1)
  }
  async onLogout(){
    await this.fs.deleteStoredUserData();
  }
}
