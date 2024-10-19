import { Component } from '@angular/core';
import { UserAuthService } from '../userauth.service';
import { User } from '../user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
  providers: [UserAuthService]
})

export class UserLoginComponent {
  
  constructor(private userAuth: UserAuthService, private router: Router) {}
  success = false;
  errorText = ""
  async onAttemptedLogin(u:string, h:string) {
      if (u && h) {
        this.errorText = ""
        const myUser = new User(u.toLowerCase(), h);
        const res = await this.userAuth.onLogin(myUser);
        if(res.success == false){
          this.errorText = res.message;
        } else{
          this.router.navigateByUrl('/dashboard');
        }
      }
      else{
        this.errorText = "Please fill out both fields."
      }
    }
}