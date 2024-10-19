import { Component, OnInit } from '@angular/core';
import { User } from '../user.model';
import { UserAuthService } from '../userauth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent implements OnInit {

  constructor(private userAuth: UserAuthService, private router: Router) { }

  ngOnInit(): void {
  }

  errorText = ""

  //username, password, confirm password
  async onAttemptedRegistration(u: string, h: string, c: string) {
    if (((u && h) && (h && c) && (h === c))) {
      //Also not sure which of these could actually cause a problem, if any
      const forbiddenUsernames: Array<string> = ['null', 'undefined', 'NaN', 'true', 'false', 'this', 'new', 'var', 'let', 'const', 'class', 'function', 'return',
        'if', 'else', 'while', 'for', 'switch', 'break', 'continue', 'try', 'catch', 'finally',
        'SELECT', 'INSERT', 'DELETE', 'UPDATE', 'WHERE', 'FROM', 'JOIN', 'TABLE', 'CREATE', 'DROP', 'ALTER', 'VIEW',
        'TRIGGER', 'INDEX', 'NULL', 'DEFAULT', 'GROUP', 'ORDER', 'HAVING', 'COUNT', 'SUM', 'DISTINCT',
        'def', 'class', 'import', 'from', 'try', 'except', 'finally', 'as', 'lambda', 'is', 'in', 'or', 'and', 'not',
        'yield', 'global', 'nonlocal', 'with', 'del',
        'admin', 'administrator', 'root', 'superuser', 'sysadmin', 'support', 'moderator', 'helpdesk', 'operator', 'service',
        'system', 'guest', 'test', 'www', 'null', 'unknown', 'nobody',
        'postmaster', 'webmaster', 'noreply', 'info', 'contact', 'support', 'mail',
        'me', 'self', 'you', 'user', 'username', 'index', 'home', 'default', 'about', 'login', 'register', 'profile',
        '\' OR \'1\'=\'1', 'DROP TABLE', '--', ';', '/*', '@', '#',
        'dashboard', 'settings', 'profile', 'search', 'notifications', 'messages', 'status',
        'doctype', 'html', 'head', 'body', 'div', 'form', 'script', 'input', 'output', 'section', 'style', 'link', 'meta', 'api',
        'bot', 'ls', 'cd', 'chmod', 'mkdir', 'rmdir', 'rm', 'touch', 'echo', 'ping', 'kill', 'shutdown', '\0'];

      if (forbiddenUsernames.includes(u)) {
        this.errorText = "This site has zero users, you're wasting your time."
        return
      }

      const myUser = new User(u, h);
      let res = await this.userAuth.onRegister(myUser);
      this.errorText = res.message;
      if (res.success == true) {
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 1500);
        return   
      }  
    } else {
      this.errorText = "You missed a field or your passwords do not match."
    }
  }

}
