import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { Post } from "./post.model";

const BACKEND_URL = environment.apiUrl + "/posts/";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                groupName:post.groupName,
                id: post._id,
                time: post.time,
                creator: post.creator,
                userName: post.userName,
                status: post.status,
                
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts,
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      time: string;
      creator: string;
      userName: string;
      status: string;
      groupName:string;
    }>(BACKEND_URL + id);
  }

  addGroup(groupName:string, userId: string){
    const groupName2= {groupName:groupName,userId:userId};
    return this.http.post(BACKEND_URL + "groupName", groupName2).pipe(map((response:Response)=>response));
  }
  getGroup(userId: string){
    return this.http.get(BACKEND_URL + "groupName/"+userId);
  }

  addPost(title: string, content: string, time: string, status: string,groupName:string) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("time", time);
    postData.append("status", status);
    postData.append("groupName", groupName);
    console.log(groupName);
    console.log(postData);
    this.http
      .post<{ message: string; post: Post }>(BACKEND_URL, postData)
      .subscribe((responseData) => {
        this.router.navigate(["/posts/home"]);
        
      });
       
  }
  deleteGroup(groupName:string,userId:string){
    let groupName2 = {groupName:groupName, userId:userId}
    return this.http.delete(BACKEND_URL +"groupName/"+groupName+"/"+userId)
  }

  updatePost(
    id: string,
    title: string,
    content: string,
    time: string,
    status: string,
    groupName:string
  ) {
    let postData: Post | FormData;
    console.log(groupName)
    postData = {
      id: id,
      title: title,
      content: content,
      time: time,
      creator: null,
      status: status,
      groupName:groupName
    };
    console.log(postData);
    this.http.put(BACKEND_URL + id, postData).subscribe((response) => {
      this.router.navigate(["/posts/home"]);
    });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }

  likePost(postId: string) {
    return this.http.get(BACKEND_URL + "like/" + postId);
  }
}
