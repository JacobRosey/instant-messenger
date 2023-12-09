import { EventEmitter, Injectable } from "@angular/core";
import { User } from "./user.model"; 
import { Router } from "@angular/router";
import { FirebaseService } from "./firebase-service";

@Injectable()
export class UserAuthService {
    loginAttempted = new EventEmitter<User>();

    constructor(private router: Router, private fs: FirebaseService) {}

    async onLogin(u: User) {
        //something something fs to query database if user exists
        const currentUser = await this.fs.getUserData(u); 
        console.log(currentUser)

        
        //Move this to somewhere after login is validated
        this.router.navigateByUrl('/dashboard')
    }

    async onRegister(u: User) {
        //Query db to see if username is taken
        const userNameTaken = await this.fs.getUserData(u); 
        alert(!userNameTaken ? `${u.username} is available!` : `${u.username} is not available.`)

        
        //Move this to somewhere after login is validated
        this.router.navigateByUrl('/dashboard')
    }

}