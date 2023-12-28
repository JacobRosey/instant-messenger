import { EventEmitter, Injectable } from "@angular/core";
import { User } from "./user.model"; 
import { Router } from "@angular/router";
import { FirebaseService } from "./firebase.service";

@Injectable()
export class UserAuthService {
    loginAttempted = new EventEmitter<User>();

    constructor(private router: Router, private fs: FirebaseService) {}

    async onLogin(u: User) {
        //First check if username exists in db
        const userExists = await this.fs.doesUserExist(u.username); 
    
        if(userExists){
            const isValidated = await this.fs.validateLogin(u);
            if(isValidated){
                await this.fs.getUserData(u.username);
                this.router.navigateByUrl('/dashboard')
            }
        } else{
            alert("User not found");
            this.router.navigateByUrl('/login');
        }
    }

    async onRegister(u: User) {
        //Query db to see if username is taken
        const userNameTaken = await this.fs.doesUserExist(u.username); 
        if(!userNameTaken){
            try{
                await this.fs.addNewUser(u);
                alert("Registration successful!");
                this.router.navigateByUrl('/login');
            }
            catch(error){console.error(error)}
        } else {
            alert(`${u.username} is not available :L`);
        }
    }
}