import { Firestore, collection, query, where, getDocs, addDoc } from "@angular/fire/firestore";
import { User } from "./user.model";
import { Injectable } from "@angular/core";
import { UserData } from "./dashboard/userdata.interface";
import { CookieService } from "ngx-cookie-service";

@Injectable()
export class FirebaseService {
    constructor(private db: Firestore, private cookies: CookieService){}

    userData = collection(this.db, 'users');
    userExists: boolean = false;
    isValidated: boolean = false;
    currentUserName: string = "null";
    
    //Add properties to interface as needed
    currentUserData: UserData = { name: '', friends: 0, messages: 0 };

    //Since this is a service I can't destroy it to reinitialize (like you can with a component),
    //So this is good enough for now. Can add arguments if that becomes necessary
    resetState() {
        this.isValidated = false;
        this.userExists = false;
      }

    //This function is used for onRegistration to see if a username is available
    //and by onLogin to see if the username exists
    async doesUserExist(user: User) {
        this.resetState();
        const userQuery = query(this.userData, where('name', '==', user.username)); 
        try {
            const querySnapshot = await getDocs(userQuery);
        
            for (const u of querySnapshot.docs) {
                const usernameMatch = user.username.toLowerCase() === u.data()['name'].toLowerCase();
                if (usernameMatch) {
                    this.userExists = true;
                    break;
                }
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
        // If user not found
        return this.userExists;
    }

    //Need to encrypt passwords and then register using an actual hash, not plaintext
    async addNewUser(user: User){
        await addDoc(this.userData, {
            name: user.username, 
            hash: user.hash, 
            friends: 0, 
            messages: 0
        });
    }

    async validateLogin(user: User){
        const hashQuery = query(this.userData, where('name', '==', user.username));
        const querySnapshot = await getDocs(hashQuery);
        querySnapshot.forEach((u) => {
            if(user.username.toLowerCase() == u.data()['name'].toLowerCase() && user.hash == u.data()['hash']){
                this.isValidated = true;
                this.currentUserName = user.username;
            } else this.isValidated = false;
        })
        return this.isValidated;
    }

    //Don't just keep calling this when routing to inbox, my friends etc. 
    //Instead share current user data across those components
    async getUserData(){
        const userQuery = query(this.userData, where('name', '==', this.currentUserName)); 

        try {
            const querySnapshot = await getDocs(userQuery);
            for (const u of querySnapshot.docs) {
                this.currentUserData = {
                    name: this.currentUserName,
                    friends: u.data()['friends'],
                    messages: u.data()['messages']
                }
                this.cookies.set('storedUserData', JSON.stringify(this.currentUserData));
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
        return this.currentUserData;
    }

    async getStoredUserData(){
        const storedUserData = this.cookies.get('storedUserData');
        if (storedUserData) {
          this.currentUserData = JSON.parse(storedUserData);
        } else {
          console.log("error")
        }
        console.log(`returning ${JSON.stringify(this.currentUserData)}`)
        return this.currentUserData;
      }
}