import { Injectable } from "@angular/core";
import { User, loginRes } from "./user.model"; 
import { Router } from "@angular/router";
import { FirebaseService } from "./firebase.service";

@Injectable()
export class UserAuthService {

    constructor(private fs: FirebaseService) {}
    
    async onLogin(u: User): Promise<loginRes> {
        const userExists = await this.fs.doesUserExist(u.username);
    
        if (!userExists) {
            return { success: false, message: "Username not found"};
        }
    
        try {
            const isValidated = await this.fs.validateLogin(u);
            if (!isValidated) {
                return { success: false, message: "Invalid username or password" };
            }
    
            await this.fs.getUserData(u.username);
            return { success: true, message: "" };
        } catch (error) {
            return { success: false, message: `An error occurred: ${error}` };
        }
    }

    async onRegister(u: User): Promise<loginRes> {
        //Query db to see if username is taken
        const userNameTaken = await this.fs.doesUserExist(u.username); 
        if(userNameTaken){
            return { success: false, message: "Sorry, that username is taken"}; 
        }
        try{
            await this.fs.addNewUser(u);
            return { success: true, message: "Success! Redirecting to login page..."};
        }
        catch(error){ return {success: false, message: `An unhandled error occurred: ${error}`}};//probably don't want to render this error on screen 

        
    }
}