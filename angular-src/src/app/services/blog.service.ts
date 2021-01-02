import { Injectable } from '@angular/core';
import { take, exhaustMap } from 'rxjs/operators';
import { AuthService } from '../components/auth/auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  domainPath = environment.domainPath;
  pageSize = 5;
  page = 1;
  constructor(private authService: AuthService, private http: HttpClient) {}

  getProfile() {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        return this.http.get(this.domainPath + 'blog/profile/' + user.id, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + user.token,
          }),
        });
      })
    );
  }

  createBlog(blogData) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        const blogPayload = { ...blogData, username: user.username };
        console.log(blogPayload);
        return this.http.post(
          this.domainPath + 'blog/create-blog',
          blogPayload,
          {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + user.token,
            }),
          }
        );
      })
    );
  }

  fetchBlogs() {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('page', this.page.toString());
    searchParams = searchParams.append('pageSize', this.pageSize.toString());
    return this.http.get(this.domainPath + 'blog/all-blogs', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      params: searchParams,
    });
  }

  fetchBlogDetails(blogId) {
    return this.http.get(this.domainPath + 'blog/blog-detail/' + blogId, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  deleteBlog(blogId) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        return this.http.delete(
          this.domainPath + 'blog/delete-blog/' + blogId,
          {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + user.token,
            }),
          }
        );
      })
    );
  }

  editBlog(blogId, blogData) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        return this.http.put(
          this.domainPath + 'blog/update-blog/' + blogId,
          blogData,
          {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + user.token,
            }),
          }
        );
      })
    );
  }
}
