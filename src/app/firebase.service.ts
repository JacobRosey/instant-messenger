import { Firestore, collection, query, where, getDocs, addDoc } from "@angular/fire/firestore";
import { User } from "./user.model";
import { Injectable } from "@angular/core";
import { UserData, Message } from "./dashboard/userdata.interface";
import { CookieService } from "ngx-cookie-service";

@Injectable()
export class FirebaseService {
    constructor(private db: Firestore, private cookies: CookieService){}

    userCollection = collection(this.db, 'users');
    userExists: boolean = false;
    isValidated: boolean = false;
    
    //Add properties to interface as needed
    currentUserData: UserData = { name: '', friends: [], messages: [] };

    //Since this is a service I can't destroy it to reinitialize (like you can with a component),
    //So this is good enough for now. Can add arguments if that becomes necessary
    resetState() {
        this.isValidated = false;
        this.userExists = false;
      }

    //Used by login/register to see if name exists/unavailable
    async doesUserExist(user: User) {
        this.resetState();
        const userQuery = query(this.userCollection, where('name', '==', user.username)); 
        try {
            const querySnapshot = await getDocs(userQuery);
            for (const u of querySnapshot.docs) {
                const usernameMatch = user.username === u.data()['name'];
                if (usernameMatch) {
                    this.userExists = true;
                    break;
                }
            }
        } catch (error) {
            console.error("Error fetching user data: ", error);
        }
        // If user not found
        return this.userExists;
    }

    //Need to encrypt passwords and then register using a hash, not plaintext
    async addNewUser(user: User){
        await addDoc(this.userCollection, {
            name: user.username.toLowerCase(), 
            hash: user.hash, 
            friends: 0, 
            messages: []
        });
    }

    async validateLogin(user: User){
        const hashQuery = query(this.userCollection, where('name', '==', user.username));
        const querySnapshot = await getDocs(hashQuery);
        querySnapshot.forEach((u) => {
            if(user.username.toLowerCase() == u.data()['name'].toLowerCase() && user.hash == u.data()['hash']){
                this.isValidated = true;
            } else this.isValidated = false;
        })
        return this.isValidated;
    }

    async getUserData(n: string){
        const userQuery = query(this.userCollection, where('name', '==', n)); 
        try {
            const querySnapshot = await getDocs(userQuery);
            for (const u of querySnapshot.docs) {
                this.currentUserData = {
                    name: n,
                    friends: u.data()['friends'],
                    messages: u.data()['messages']
                }
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }  
        this.cookies.set('storedUserData', JSON.stringify(this.currentUserData));
        return this.currentUserData;
    }

    async getStoredUserData(){
        const storedUserData = this.cookies.get('storedUserData');
        if (storedUserData) {
          this.currentUserData = JSON.parse(storedUserData);
        } else {
          console.log("error")
        }
        return this.currentUserData;
    }

    async deleteStoredUserData(){
        this.cookies.delete('storedUserData')
    }
}