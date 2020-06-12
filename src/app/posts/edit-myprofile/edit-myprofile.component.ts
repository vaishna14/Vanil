import { Component, OnInit, OnDestroy, OnChanges } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { PostsService } from "../posts.service";
import { Subscription } from "rxjs";

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
  private authListenerSubs: Subscription;

  constructor(
    public route: ActivatedRoute,
    public postService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userName = this.authService.getUserName();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userName = this.authService.getUserName();
        this.userId = this.authService.getUserId();
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
