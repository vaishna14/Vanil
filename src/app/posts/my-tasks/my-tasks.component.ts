import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from "rxjs";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { AuthService } from "../../auth/auth.service";
import { FormGroup, NgForm, FormControl, Validators } from "@angular/forms";
import { post } from "jquery";
import { async } from "@angular/core/testing";
import { Router } from "@angular/router";

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.css']
})
export class MyTasksComponent implements OnInit {

  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20, 50];
  userIsAuthenticated = false;
  userId: string;
  userName: string;
  private authStatusSub: Subscription;
  showShare: boolean;
  showModal: boolean;
  form: NgForm;
  groupList = [];
  checkList = [];
  action: string;
  type1List = [];
  type2List = [];
  lastUpdated:string;
  Lists: any;
  myProfile:any;
  constructor(
    public postsService: PostsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.userName = this.authService.getUserName();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
        this.userName = this.authService.getUserName();
      });
      this.postsService.getPosts(2,2).subscribe((data) => {   
        let postList=[]     
        postList = Object.values(data)[1];
        postList.map(item=>{
          // console.log(item)
          if (item._id === this.userId){
            this.posts=item;
            this.myProfile =item.myAvatar;
            console.log(this.myProfile);
          }
        })
      });
      this.postsService
      .getMyPosts(this.userId)
      .subscribe((data) => {        
        this.posts = Object.values(data)[1][0].tasks;
      console.log(this.posts);
      this.isLoading = false;
      });
      
    
      
  }


  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId, this.userId).subscribe(
      () => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    // this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  close() {
    this.showModal = false;
  }
}
