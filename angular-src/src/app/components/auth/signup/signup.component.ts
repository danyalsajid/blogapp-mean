import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  username: string;
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
      username: f.value.username,
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

    this.authService.signup(user).subscribe(
      (data) => {
        console.log(data);
        this.flashMessage.show('User registered !', {
          cssClass: 'alert-success',
          timeout: 3000,
        });
        this.router.navigate(['/login']);
      },
      (error) => {
        console.log(error);
        this.flashMessage.show(error.error.msg, {
          cssClass: 'alert-danger',
          timeout: 3000,
        });
        this.router.navigate(['/signup']);
      }
    );
  }
}
