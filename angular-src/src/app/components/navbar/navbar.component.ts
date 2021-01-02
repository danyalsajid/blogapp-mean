import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(
    private flashMessage: FlashMessagesService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(
      (user) => (this.isAuthenticated = !!user)
    );
  }

  onLogoutClick() {
    this.authService.logout();
    this.flashMessage.show('You are logged out!', {
      cssClass: 'alert-success',
      timeout: 3000,
    });
    return false;
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
