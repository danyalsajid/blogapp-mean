import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog.service';
import { Router } from '@angular/router';
import { Blog } from '../../models/blog.model';

export interface userData {
  username: string;
  email: string;
  blogs: Blog[];
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userData: userData = {
    username: '',
    email: '',
    blogs: [],
  };

  loading = true;
  constructor(private service: BlogService, private router: Router) {}

  ngOnInit(): void {
    this.service.getProfile().subscribe(
      (data) => {
        this.userData = data as userData;
        this.loading = false;
      },
      (err) => console.log(err)
    );
  }
}
