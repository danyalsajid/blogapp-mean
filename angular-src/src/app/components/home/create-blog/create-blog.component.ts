import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BlogService } from 'src/app/services/blog.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.css'],
})
export class CreateBlogComponent implements OnInit {
  title = '';
  description = '';

  @Output() createdBlogEvent = new EventEmitter();
  @Output() cancelEvent = new EventEmitter();
  constructor(
    private service: BlogService,
    private flashMessage: FlashMessagesService
  ) {}

  ngOnInit(): void {}

  onSubmit(f) {
    const blogData = {
      title: f.value.title,
      description: f.value.description,
    };
    this.service.createBlog(blogData).subscribe((data) => {
      this.flashMessage.show('Blog Created!', {
        cssClass: 'alert-success',
        timeout: 3000,
      });

      this.createdBlogEvent.emit(true);
      this.cancelEvent.emit(true);

    });
  }

  cancel() {
    this.cancelEvent.emit(true);
  }
}
