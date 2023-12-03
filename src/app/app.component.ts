import { Component } from '@angular/core';
import { UserAuthService } from './userauth.service';
//import {initializeApp} from 'firebase/app'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UserAuthService]
})
export class AppComponent {
  title = 'instant-messenger';
}
