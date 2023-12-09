import { Component } from '@angular/core';
import { UserAuthService } from './userauth.service';
import { FirebaseService } from './firebase-service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UserAuthService, FirebaseService]
})
export class AppComponent {
  title = 'cipherchat';
}
