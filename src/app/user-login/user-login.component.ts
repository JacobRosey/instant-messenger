import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserAuthService } from '../userauth.service';
import { User } from '../user.model';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
  providers: [UserAuthService]
})
export class UserLoginComponent {
  
  constructor(private authServ: UserAuthService) {}

  //On successful login, go to /dashboard as User
  //Also just make login page look like dashboard page, shits way cleaner
  //Just make a new component for registration, use login form html but with a 
  //a confirm password field added

  onAttemptedLogin(u:string, h:string) {
      if (u && h) {
        alert(`login: username is ${u}, password is ${h}`)
        const myUser = new User(u, h);
        this.authServ.onLoginOrRegister(myUser, true);
      }
    }
}