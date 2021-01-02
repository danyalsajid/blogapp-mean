import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Blog } from '../../models/blog.model';
import { AuthService } from '../auth/auth.service';
import { BlogService } from 'src/app/services/blog.service';
import { Subscription } from 'rxjs';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit, OnDestroy {
  private userSub: Subscription;

  canChange = false;
  editMode = false;
  loading = true;

  title = '';
  description = '';

  blog: Blog = {
    id: '',
    title: '',
    description: '',
    username: '',
    createdAt: '',
  };
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,

    private service: BlogService,
    private flashMessage: FlashMessagesService
  ) {}

  ngOnInit(): void {
    const blogId = this.route.snapshot.params['blogId'];

    this.service.fetchBlogDetails(blogId).subscribe(
      (data) => {
        this.blog = data as Blog;

        this.userSub = this.authService.user.subscribe((user) => {
          if (user)
            if (user.username === this.blog.username) this.canChange = true;
          this.loading = false;
        });
      },
      (err) => console.log(err)
    );
  }

  onDelete() {
    this.service.deleteBlog(this.blog.id).subscribe(
      (res) => {
        this.flashMessage.show('The blog has been deleted!', {
          cssClass: 'alert-danger',
          timeout: 3000,
        });
        this.router.navigate(['/home']);
      },
      (err) => console.log(err)
    );
  }

  onEdit() {
    this.editMode = true;
    this.title = this.blog.title;
    this.description = this.blog.description;
  }

  onUpdate() {
    const blogData = {
      title: this.title,
      description: this.description,
    };
    this.service.editBlog(this.blog.id, blogData).subscribe(
      (res) => {
        this.editMode = false;
        this.blog.title = res['blog']['title'];
        this.blog.description = res['blog']['description'];

        this.flashMessage.show('Blog updated!', {
          cssClass: 'alert-success',
          timeout: 3000,
        });
      },
      (err) => console.log(err)
    );
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
