import { Firestore, collection, query, where, getDocs, addDoc, doc, getDoc, Timestamp, updateDoc, arrayUnion } from "@angular/fire/firestore";
import { User } from "./user.model";
import { Injectable } from "@angular/core";
import { UserData, Message } from "./dashboard/userdata.interface";

@Injectable()
export class FirebaseService {
    constructor(private db: Firestore) { }

    userCollection = collection(this.db, 'users');
    userExists: boolean = false;
    isValidated: boolean = false;

    //Add properties to interface as needed
    currentUserData: UserData = { name: '', friends: [], messages: [], requests: [] };

    resetState() {
        this.isValidated = false;
        this.userExists = false;
    }

    //Used by login/register to see if name exists/unavailable
    async doesUserExist(username: string) {
        this.resetState();
        const userQuery = query(this.userCollection, where('name', '==', username));
        try {
            const querySnapshot = await getDocs(userQuery);
            for (const u of querySnapshot.docs) {
                if (username === u.data()['name']) {
                    this.userExists = true;
                    break;
                }
            }
        } catch (error) {
            console.error("Error fetching user data: ", error);
        }
        // can or cannot register this username / valid or invalid username is attempting login
        return this.userExists;
    }

    //Need to encrypt passwords and then register using a hash, not plaintext
    async addNewUser(user: User) {
        await addDoc(this.userCollection, {
            name: user.username.toLowerCase(),
            hash: user.hash,
            friends: 0,
            messages: []
        });
    }

    //sender, recipient, message text
    async addMessage(s: string, r: string, t: string) {
        const senderQuery = query(this.userCollection, where('name', '==', s));
        const recipientQuery = query(this.userCollection, where('name', '==', r));

        const senderQuerySnapshot = await getDocs(senderQuery)
        const recipientQuerySnapshot = await getDocs(recipientQuery);

        const senderID = senderQuerySnapshot.docs[0].id
        const recipientID = recipientQuerySnapshot.docs[0].id

        const senderMessages = doc(this.userCollection, senderID)
        const recipientMessages = doc(this.userCollection, recipientID)

        const thisVeryMoment = Timestamp.fromDate(new Date());

        const thisMsg : Message = {
            isRead : false, 
            timestamp : thisVeryMoment, 
            content : t,
            sender : s,
            recipient: r
        };

        try {
            await updateDoc(recipientMessages, {
                messages: arrayUnion(thisMsg),
            })

            await updateDoc(senderMessages, {
                messages: arrayUnion(thisMsg)
            })
        } catch (error) { return console.error(error);}

        this.currentUserData.messages.push(thisMsg)
        this.updateStoredUserData();
    }

    async validateLogin(user: User) {
        const hashQuery = query(this.userCollection, where('name', '==', user.username));
        const querySnapshot = await getDocs(hashQuery);
        querySnapshot.forEach((u) => {
            if (user.username.toLowerCase() == u.data()['name'].toLowerCase() && user.hash == u.data()['hash']) {
                this.isValidated = true;
            } else this.isValidated = false;
        })
        return this.isValidated;
    }

    //Only used on initial login or when checking for updates (new messages, requests etc)
    async getUserData(n: string) {
        const userQuery = query(this.userCollection, where('name', '==', n));
        try {
            const querySnapshot = await getDocs(userQuery);
            if (querySnapshot.empty) {
                console.error("No user data found for name:", n);
                return null;
            }
            const u = querySnapshot.docs[0];
            this.currentUserData = {
                name: n,
                friends: u.data()['friends'] || [],
                messages: u.data()['messages'] || [],
                requests: u.data()['requests'] || []
            };
            try {

                if (this.currentUserData) {
                    localStorage.setItem('storedUserData', JSON.stringify(this.currentUserData));
                } else {
                    console.error("No valid user data found, local storage not set.");
                }
            } catch (error) {
                console.error("Error occurred while setting local storage:", error);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
        return this.currentUserData;
    }

    //Used to keep data across page refresh
    async getStoredUserData() {
        const dataExists = localStorage.getItem('storedUserData');

        if (dataExists) {
            try {
                this.currentUserData = JSON.parse(dataExists);
                console.log("Parsed user data:", this.currentUserData);
            } catch (error) {
                console.error("Error parsing storedUserData:", error);
            }
        } else {
            console.log("error: No data in local storage.");
        }

        return this.currentUserData;
    }

    updateStoredUserData(){
    localStorage.setItem('storedUserData', JSON.stringify(this.currentUserData))
    }

    async deleteStoredUserData() {
        localStorage.clear();
    }

    //sender username, recipient username
    async addFriend(sUser: string, rUser: string) {
        //do add friend stuff here
        const senderQuery = query(this.userCollection, where('name', '==', sUser));
        const recipientQuery = query(this.userCollection, where('name', '==', rUser));

        const senderQuerySnapshot = await getDocs(senderQuery)
        const recipientQuerySnapshot = await getDocs(recipientQuery);

        const senderID = senderQuerySnapshot.docs[0].id
        const recipientID = recipientQuerySnapshot.docs[0].id

        const senderRequests = doc(this.userCollection, senderID)
        const recipientRequests = doc(this.userCollection, recipientID)

        const thisVeryMoment = Timestamp.fromDate(new Date());

        try {
            await updateDoc(senderRequests, {
                requests: arrayUnion({
                    name: rUser,
                    isSender: true,
                    timestamp: thisVeryMoment,
                    isPending: true
                }),
            })

            await updateDoc(recipientRequests, {
                requests: arrayUnion({
                    name: sUser,
                    isSender: false,
                    timestamp: thisVeryMoment,
                    isPending: true
                })
            })
        } catch (error) {
            console.error(error);
            return false;
        }
        return true;
    }
}