import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, NgForm, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";
import { MyPost } from "../myPost.model";
import { mimeType } from "./mime-type.validator";
import { AuthService } from "../../auth/auth.service";
@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css", "../../app.component.css"],
})
export class PostCreateComponent implements OnInit, OnDestroy {
  enteredTitle = "";
  enteredContent = "";
  post: MyPost;
  isLoading = false;
  form: NgForm;
  imagePreview: string;
  private mode = "create";
  private postId: string;
  private authStatusSub: Subscription;
  selected = "NotStarted";
  groupList=[];
  userId: string;
  userName: string;
  userIsAuthenticated = false;
  groupSelected:"Other";

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
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
      this.postsService.getGroup(this.userId).subscribe(data=>{
      this.groupList = (Object.values(data))[0];  
      })
    
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      console.log("hi");
      if (paramMap.has("postId")) {
        
        
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getMyPost(this.postId, this.userId).subscribe((postData) => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            description: postData.content,
            time:postData.time,
            status:postData.status
          };
          this.form.setValue({
            id: this.post.id,
            title: this.post.title,
            description: this.post.description,
            time: this.post.time,
            status: this.post.status,
            // groupName:this.post.groupName
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
      
    });

  }

  // onImagePicked(event: Event) {
  //   const file = (event.target as HTMLInputElement).files[0];
  //   form.patchValue({ image: file });
  //   form.get("image").updateValueAndValidity();
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     this.imagePreview = reader.result as string;
  //   };
  //   reader.readAsDataURL(file);
  // }

  onSavePost(form: NgForm) {
    console.log(form.value);
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.postsService.addPost(
        form.value.title,
        form.value.description,
        form.value.time,
        form.value.status,
        this.userId,
      );
    } else {
      this.postsService.updateMyPost(
        this.userId,
        this.postId,
        form.value.title,
        form.value.description,
        form.value.time,
        form.value.status,
        // form.value.groupName
      );
    }
    form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
