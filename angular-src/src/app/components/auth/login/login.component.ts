import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;

  constructor(
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(f) {
    const user = {
      email: f.value.email,
      password: f.value.password,
    };

    if (!f.valid) {
      this.flashMessage.show('Invalid values !', {
        cssClass: 'alert-danger',
        timeout: 3000,
      });
      return;
    }

    this.authService.login(user).subscribe(
      (data) => {
        this.flashMessage.show('You are logged in !', {
          cssClass: 'alert-success',
          timeout: 2000,
        });
        this.router.navigate(['/home']);
      },
      (error) => {
        console.log(error);
        this.flashMessage.show(error.error.msg, {
          cssClass: 'alert-danger',
          timeout: 3000,
        });
        this.router.navigate(['/login']);
      }
    );
  }
}
