import { Firestore, collection, query, where, getDocs, addDoc, doc, getDoc, Timestamp, updateDoc, arrayUnion } from "@angular/fire/firestore";
import { User } from "./user.model";
import { Injectable } from "@angular/core";
import { UserData, Message } from "./dashboard/userdata.interface";
import { CookieService } from "ngx-cookie-service";

@Injectable()
export class FirebaseService {
    constructor(private db: Firestore, private cookies: CookieService) { }

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
                const usernameMatch = username === u.data()['name'];
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

        try {
            await updateDoc(recipientMessages, {
                messages: arrayUnion({
                    sender: s,
                    recipient: r,
                    content: t,
                    isRead: false,
                    timestamp: thisVeryMoment,
                }),
            })

            await updateDoc(senderMessages, {
                messages: arrayUnion({
                    sender: s,
                    recipient: r,
                    content: t,
                    isRead: false,
                    timestamp: thisVeryMoment,
                })
            })
        } catch (error) { console.error(error) }
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

    async getUserData(n: string) {
        const userQuery = query(this.userCollection, where('name', '==', n));
        try {
            const querySnapshot = await getDocs(userQuery);
            for (const u of querySnapshot.docs) {
                this.currentUserData = {
                    name: n,
                    friends: u.data()['friends'],
                    messages: u.data()['messages'],
                    requests: u.data()['requests']
                }
            }
            console.log(this.currentUserData)
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
        this.cookies.set('storedUserData', JSON.stringify(this.currentUserData));
        return this.currentUserData;
    }

    async getStoredUserData() {
        const storedUserData = this.cookies.get('storedUserData');
        if (storedUserData) {
            this.currentUserData = JSON.parse(storedUserData);
        } else {
            console.log("error")
        }
        return this.currentUserData;
    }

    async deleteStoredUserData() {
        this.cookies.delete('storedUserData')
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