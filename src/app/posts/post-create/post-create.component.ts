import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, NgForm, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";
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
  post: Post;
  isLoading = false;
  form: NgForm;
  imagePreview: string;
  private mode = "create";
  private postId: string;
  private authStatusSub: Subscription;
  selected = "NotStarted";

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
    // this.form = new FormGroup({
    //   title: new FormControl(null, {
    //     validators: [Validators.required, Validators.minLength(3)],
    //   }),
    //   content: new FormControl(null, { validators: [Validators.required] }),
    //   time: new FormControl(null, { validators: [Validators.required] }),
    //   status: new FormControl(null, { validators: [Validators.required] }),
    //   // image: new FormControl(null, {
    //   //   validators: [Validators.required],
    //   //   asyncValidators: [mimeType],
    //   // }),
    //   // likes: new FormControl(null, null),
    // });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          console.log(postData);
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            time: postData.time,
            creator: postData.creator,
            status: postData.status,
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            time: this.post.time,
            status: this.post.status,
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
      console.log(this.mode);
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
        form.value.status
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        form.value.title,
        form.value.description,
        form.value.time,
        form.value.status
      );
    }
    form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
