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
        const userExists = await this.fs.doesUserExist(u); 
    
        if(userExists){
            const isValidated = await this.fs.validateLogin(u);
            alert(isValidated ? "Login Successful" : "Invalid password");
            this.router.navigateByUrl(isValidated ? '/dashboard' : '/login')
        } else{
            alert("User not found")
        }
    }

    async onRegister(u: User) {
        //Query db to see if username is taken
        const userNameTaken = await this.fs.doesUserExist(u); 
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