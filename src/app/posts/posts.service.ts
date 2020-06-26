import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { Post } from "./post.model";
import { MyPost } from "./myPost.model";

const BACKEND_URL = environment.apiUrl + "/posts/";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    return this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL
      )
  }

  getMyPosts(userId: string) {
    // const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    return this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + "myPosts/"+userId
      )
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      userName: string;
      tasks: [];
      groupName:string
    }>(BACKEND_URL + id);
  }

  getMyPost(id: string,userId:string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      time:string;
      status:string;
    }>(BACKEND_URL+"myPosts/" + id+"/"+userId);
  }

  addGroup(groupName:string, userId: string){
    const groupName2= {groupName:groupName,userId:userId};
    return this.http.post(BACKEND_URL + "groupName", groupName2).pipe(map((response:Response)=>response));
  }
  getGroup(userId: string){
    return this.http.get(BACKEND_URL + "groupName/"+userId);
  }

  addPost(title: string, content: string, time: string, status: string, userId:string) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("time", time);
    postData.append("status", status);
    postData.append("userId", userId);
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
    userName: string,
    tasks: [],
    // time: string,
    // status: string,
    groupName:string,
    myAvatar:string
  ) {
    let postData: Post | FormData;
    postData = {
      id: id,
      userName: userName,
      tasks: tasks,
      // time: time,
      // creator: null,
      // status: status,
      groupName:groupName,
      myAvatar:myAvatar
    };

    this.http.put(BACKEND_URL + id, postData).subscribe((response) => {
      this.router.navigate(["/posts/home"]);
    });
  }


  updateMyPost(
    userId:string,
    id: string,
    title: string,
    description: string,
    time: string,
    // tasks: [],
    // time: string,
    status: string,
    // groupName:string
  ) {
    let postData: MyPost | FormData;
    postData = {
      id: id,
      title: title,
      description:description,
      time: time,
      // creator: null,
      status: status,
      // groupName:groupName
    };
    console.log(postData);
    this.http.put(BACKEND_URL+"myPosts/" +userId, postData).subscribe((response) => {
      this.router.navigate(["/posts/home"]);
    });
  }

  updateMyProfile(userId:string, profile:string){
    let userProfile={userId:userId,profile:profile}
    return this.http.post(BACKEND_URL+"myProfile/",userProfile);
  }

  deletePost(postId: string, userId: string) {
    return this.http.delete(BACKEND_URL + postId +"/"+userId);
  }

  likePost(postId: string) {
    return this.http.get(BACKEND_URL + "like/" + postId);
  }
}
