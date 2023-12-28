import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoginComponent } from './user-login/user-login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { InboxComponent } from './dashboard/inbox/inbox.component';
import { FriendsComponent } from './friends/friends.component';

const routes: Routes = [{path: 'register', component:UserRegisterComponent},
                        {path:'dashboard', component: DashboardComponent}, 
                        {path: 'login', component: UserLoginComponent},
                        {path: 'inbox', component: InboxComponent},
                        {path: 'friends', component: FriendsComponent},
                        {path:'', component: LandingPageComponent},
                        {path:'**', pathMatch: 'full', component: PagenotfoundComponent} ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
