import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { UserData } from '../dashboard/userdata.interface';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {
  
  isLoading: boolean = true;

  constructor(private fs: FirebaseService) { }

  userData: UserData = {name: '', friends: [], messages: [], requests: [] };

  async ngOnInit() {
    await this.getStoredUserData();
  }

  async getStoredUserData() {
    try {
      this.userData = await this.fs.getStoredUserData();
    } catch (err) { console.error(err) } finally {
      this.isLoading = false;
    };
  }

  async addFriend(name: string){
    const userExists = await this.fs.doesUserExist(name);
    if(userExists){
      if(this.userData.name.toLowerCase() == name){
        alert("Did you really just try to add yourself as a friend?")
        return;
      }
      await this.fs.addFriend(this.userData.name.toLowerCase(), name)
    }
    alert("Just tried adding friend")
}
}
