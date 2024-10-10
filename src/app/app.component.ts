import { Component } from '@angular/core';
import { UserAuthService } from './userauth.service';
import { FirebaseService } from './firebase.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UserAuthService, FirebaseService]
})
export class AppComponent {
  title = 'cipherchat';
  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0);
    });
  }
}
