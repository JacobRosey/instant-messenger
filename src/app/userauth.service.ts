import { EventEmitter, Injectable } from "@angular/core";
import { User } from "./user.model"; 

@Injectable()
export class UserAuthService {
    loginAttempted = new EventEmitter<User>();

    constructor() {}

    onLoginOrRegister(u: User, isLogin: boolean) {
        console.log(u, isLogin);
    }

}

//Where the fuck do i add User 