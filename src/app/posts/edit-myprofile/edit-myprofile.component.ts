import { Component, OnInit, OnDestroy, OnChanges } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { PostsService } from "../posts.service";
import { Subscription } from "rxjs";
import { FormGroup, NgForm, FormControl, Validators } from "@angular/forms";
import {Post} from '../post.model'
import { AuthService } from "../../auth/auth.service";
@Component({
  selector: "app-edit-myprofile",
  templateUrl: "./edit-myprofile.component.html",
  styleUrls: ["./edit-myprofile.component.css"],
})
export class EditMyprofileComponent implements OnInit, OnDestroy, OnChanges {
  userId: string;
  userIsAuthenticated = false;
  userName: string;
  groupList:[];
  private mode = "create";
  private postId: string;
  private authListenerSubs: Subscription;
  isLoading:boolean;
  post: Post;
  form: NgForm;
  description:string;
  tasks:[];
  groupName:string;
  Name:string;

  constructor(
    public route: ActivatedRoute,
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.userName = this.authService.getUserName();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
        this.userName = this.authService.getUserName();
      });
      this.postsService.getGroup(this.userId).subscribe(data=>{
      this.groupList = (Object.values(data))[0];  
      })
    
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      console.log("hi");
      if (paramMap.has("postId")) {
        
        
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.Name = postData.userName
          this.groupName = postData.groupName
          this.tasks = postData.tasks
          // console.log(postData);
          // this.post = {
          //   id: postData._id,
          //   userName: postData.userName,
          //   tasks: postData.tasks,
          //   groupName:postData.groupName
          // };
          console.log(postData);    
          
          // this.form.setValue({
          //   userName: this.post.userName,
          //   tasks: this.post.tasks,
          //   // time: this.post.time,
          //   // status: this.post.status,
          //   groupName:this.post.groupName
          // });
          // console.log(this.post.groupName);
          
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
      
    });
  }
  ngOnChanges() {
    this.userName = this.authService.getUserName();
    this.userId = this.authService.getUserId();
  }
  onLogout() {
    this.authService.logout();
  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
