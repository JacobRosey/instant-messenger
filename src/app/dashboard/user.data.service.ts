import { Component, Injectable, OnInit } from '@angular/core';
import { UserData } from './userdata.interface';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

@Injectable()
export class UserDataService {

    constructor(private fs: FirebaseService){}

    userData: UserData = {name: '', friends: 0, messages: 0 };

    async getUserData(){
        this.userData = await this.fs.getUserData();
        return this.userData;
    }

}

