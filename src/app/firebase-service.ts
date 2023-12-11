import { Firestore, collection, query, where, getDocs, addDoc } from "@angular/fire/firestore";
import { User } from "./user.model";
import { Injectable } from "@angular/core";

@Injectable()
export class FirebaseService {
    constructor(private db: Firestore){}

    userData = collection(this.db, 'users');
    userExists: Boolean = false;
    isValidated: Boolean = false;

    //Since this is a service I can't destroy it to reinitialize (like you can with a component),
    //So this is good enough for now. Add arguments if that becomes necessary
    resetState() {
        this.isValidated = false;
        this.userExists = false;
      }

    //This function is used for onRegistration to see if a username is available
    //and by onLogin to see if the username exists
    async doesUserExist(user: User, isLogin: Boolean) {
        this.resetState();
        const userQuery = query(this.userData, where('name', '==', user.username)); 
        try {
            const querySnapshot = await getDocs(userQuery);
        
            for (const u of querySnapshot.docs) {
                const usernameMatch = user.username.toLowerCase() === u.data()['name'].toLowerCase();
                if (usernameMatch) {
                    this.userExists = true;
                    if (isLogin) {
                        this.validateLogin(user);
                    } 
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
        const hashQuery = query(this.userData, where('name', '==', user.username), where('hash', '==', user.hash));
        const querySnapshot = await getDocs(hashQuery);
        querySnapshot.forEach((u) => {
            if(user.username.toLowerCase() == u.data()['name'].toLowerCase() && user.hash == u.data()['hash']){
                this.isValidated = true;
            } else this.isValidated = false;
        }) 
        return this.isValidated;
    }

    /* Get relevant data here: friends, messages, etc.
    async getUserData(u: User){

    }
    */

}