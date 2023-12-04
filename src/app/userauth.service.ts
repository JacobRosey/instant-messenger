import { EventEmitter, Injectable } from "@angular/core";
import { User } from "./user.model"; 
import { Router } from "@angular/router";
//import { Firestore } from "@angular/fire/firestore";

@Injectable()
export class UserAuthService {
    loginAttempted = new EventEmitter<User>();

    constructor(private router: Router, /*private fs: Firestore*/) {}

    onLoginOrRegister(u: User, isLogin: boolean) {
        console.log(u, isLogin);
        //Move this to somewhere after login is validated
        this.router.navigateByUrl( isLogin ? '/dashboard' : '/register')
    }

}