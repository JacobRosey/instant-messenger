import { Firestore, collection, query, where, getDocs } from "@angular/fire/firestore";
import { User } from "./user.model";
import { Injectable } from "@angular/core";

@Injectable()
export class FirebaseService {
    constructor(private db: Firestore){}
    currentUser: User = {username: 'null', hash: 'null'};
    successfulLogin: Boolean = false;

    //Wrong
    async getUserData(user: User) {
        //Without setting to false again, you could login succesfully then press browser back button 
        //and enter incorrect info and successfulLogin would still == true because the page 
        //wasn't refreshed. Remove after adding cookies to remember users
        this.successfulLogin = false;
        
        const collectionInstance = collection(this.db, 'users');
        const userQuery = query(collectionInstance, where('name', '==', user.username)); 

        const querySnapshot = await getDocs(userQuery);
        querySnapshot.forEach((u) => {
            // add && hash == hash once i get encryption set up
            if(user.username.toLowerCase() == u.data()['name'].toLowerCase()){
                this.successfulLogin = true;
                console.log(u.data)
            }
        })
        console.log(this.currentUser)
        return this.successfulLogin;
    }

    async addUserData(user: User){
        const collectionInstance = collection(this.db, 'users');
        //Do registration stuff here (setDoc)
    }

}