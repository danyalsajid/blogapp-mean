import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Subscription } from 'rxjs';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;

  loading = true;
  createBlog = false;

  blogs: any = [];
  totalBlogs = 0;

  constructor(
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    public blogService: BlogService
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });

    this.fetchBlogs();
  }

  fetchBlogs() {
    this.blogService.fetchBlogs().subscribe((data) => {
      this.blogs = data['blogs'];
      this.totalBlogs = data['count'];
      this.loading = false;
    });
  }

  onCreateBlog() {
    if (!this.isAuthenticated) {
      this.flashMessage.show('Please login or signup first!', {
        cssClass: 'alert-warning',
        timeout: 3000,
      });
      return;
    }

    this.createBlog = true;
  }

  changePage($event) {
    this.loading = true;
    this.blogService.page = $event;
    window.scrollTo(0, 0);
    this.fetchBlogs();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
