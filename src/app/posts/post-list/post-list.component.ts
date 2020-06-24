import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from "rxjs";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { AuthService } from "../../auth/auth.service";
import { FormGroup, NgForm, FormControl, Validators } from "@angular/forms";
import { post } from "jquery";
import { async } from "@angular/core/testing";
import { Router } from "@angular/router";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css", "../../../app/app.component.css"],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20, 50];
  userIsAuthenticated = false;
  userId: string;
  userName: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  showShare: boolean;
  showModal:boolean;
  form: NgForm;
  groupList=[];
  checkList=[];
  action:string;
  type1List=[];
  type2List=[];
  
  constructor(
    public postsService: PostsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage).subscribe(data=>
      {this.posts = Object.values(data)[1]
      console.log(this.posts);}
      
      );
    this.userId = this.authService.getUserId();
    this.userName = this.authService.getUserName();
    // this.postsSub = this.postsService
    //   .getPostUpdateListener()
    //   .subscribe((postData: { posts: Post[]; postCount: number }) => {
    //     this.isLoading = false;
    //     this.totalPosts = postData.postCount;
    //     // this.posts = postData.posts;
    //   });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
        this.userName = this.authService.getUserName();
        
      });
      // this.postsService.getGroup(this.userId).subscribe(data=>{
      // this.groupList = (Object.values(data))[0];      
      //     this.sort();
      // })
      this.isLoading = false;
  }
  sort= async()=>{
    
    this.posts.map((i,j)=>{
      console.log(i);
      
      if (Object.values(i)[2] === 'Type1'){
        this.type1List.push(i);   
        console.log(i);
        console.log(Object.values(i)[2]);
        
            
      }else if (Object.values(i)[2] === 'Type2') {
        this.type2List.push(i);
      }
     }) 
  
}
  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(
      () => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  addGroup(condition){
    console.log(condition);
    if (condition ==="Create"){
    this.showModal= true;
    this.action = condition;
    console.log(this.showModal);
    }else if (condition === "Delete"){
      this.showModal= true;
    this.action = condition;
    }
  }

  close(){
    this.showModal=false;
  }

  createGroup(groupName){
    console.log(groupName.value);
    this.postsService.addGroup(groupName.value, this.userId).subscribe(data=>{
      this.showModal = false;
      this.postsService.getGroup(this.userId).subscribe(data=>{
        this.groupList = (Object.values(data))[0]; 
      })
    });
    groupName="";
    this.ngOnInit();
  }
  deleteGroup(groupName){
    console.log(groupName);
    this.postsService.deleteGroup(groupName, this.userId).subscribe(data=>{
      this.postsService.getGroup(this.userId).subscribe(data=>{
        this.groupList = (Object.values(data))[0]; 
    });
  })
  }

  // Drag and Drop 
  todos = this.type1List;
  completed = this.type2List;
  onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data,
        event.previousIndex,
        event.currentIndex);
        
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex, event.currentIndex);
        console.log("event.container.data "+event.container.data);
        console.log("event.previousIndex "+event.previousIndex);
        console.log("event.currentIndex "+event.currentIndex);
    }
  }



}
