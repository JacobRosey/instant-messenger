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

  //username, password, confirm password
  onAttemptedRegistration(u:string, h:string, c:string) {
    if ((u && h)&&(h === c)) {
      //Should just import an array of all restricted keywords and check for those
      //With a bigger array I might want to figure out how to search the array faster 
      //Also not sure which of these could actually cause a problem, if any
      const forbiddenUsernames : Array<string> = ['admin', 'sudo', 'null', 'undefined', 'string', 'number', 'boolean'];
      if(forbiddenUsernames.includes(u)){return alert("Stop trying to break stuff");}

      const myUser = new User(u, h);
      this.authServ.onRegister(myUser);
    } else {alert("You forgot a field or your password does not match")}
  }

}
