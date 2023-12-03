import { Component, OnInit } from '@angular/core';
import { User } from '../user.model';
import { UserAuthService } from '../userauth.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent implements OnInit {

  constructor(private authServ: UserAuthService) { }

  ngOnInit(): void {
  }

  onAttemptedRegistration(u:string, h:string) {
    if (u && h) {
      alert(`registration: username is ${u}, password is ${h}`)
      const myUser = new User(u, h);
      this.authServ.onLoginOrRegister(myUser, false);
    }
  }

}
