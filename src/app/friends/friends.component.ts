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
    let canAddUser : boolean = true;
    
    if(userExists){
      if(this.userData.name.toLowerCase() == name){
        alert("Did you really just try to add yourself as a friend?")
        canAddUser = false;
      }
      if(this.userData.friends.length){
        this.userData.friends.forEach((f) => {
          if(name.toLowerCase() == f.toLowerCase()){
            alert(`${name} is already on your friends list!`)
            canAddUser = false;
          }
        })
      }
      if(this.userData.requests.length){
        this.userData.requests.forEach((r)=>{
          if(r.name.toLowerCase() == name.toLowerCase()){
            if(r.isPending){
              alert(`You already have a pending friend request for ${name}`)
            } else{
              alert(`${name} denied your previous friend request.`)
            }
            canAddUser = false;
          }
        })
      }
      if(canAddUser){
        const friendAdded = await this.fs.addFriend(this.userData.name.toLowerCase(), name)
        alert(friendAdded ? `Sent friend request to ${name}!` : `Failed to send friend request to ${name}. Please try again`);
      }
    } else{
      alert("Could not find a user with that name. Please try again");
      return;
    }
}
}
