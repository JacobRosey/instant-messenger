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

  onAttemptedLogin(u:string, h:string) {
      if (u && h) {
        alert(`login: username is ${u}, password is ${h}`)
        const myUser = new User(u, h);
        this.authServ.onLoginOrRegister(myUser, true);
      }
    }

  onAttemptedRegister(u:string, h:string) {
    if (u && h) {
      alert(`registration: username is ${u}, password is ${h}`)
      const myUser = new User(u, h);
      this.authServ.onLoginOrRegister(myUser, true);
    }
  }
}