import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blogs-list',
  templateUrl: './blogs-list.component.html',
  styleUrls: ['./blogs-list.component.css'],
})
export class BlogsListComponent implements OnInit {
  @Input() blog: {
    _id: string;
    title: string;
    description: string;
    username: string;
    createdAt: string;
  } = null;

  constructor(private router: Router) {}

  ngOnInit(): void { }

  onShowDetail() {
    this.router.navigate(['detail/' + this.blog._id])
  }
}
