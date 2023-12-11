import { Component } from '@angular/core';
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
        const myUser = new User(u, h);
        this.authServ.onLogin(myUser);
      }
    }
}