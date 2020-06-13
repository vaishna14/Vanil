import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { AuthService } from "./auth/auth.service";
// import { ErrorService } from "./error/error.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  // hasError = false;
  // private errorSub: Subscription;
  userIsAuthenticated = false;
  userName: string;
  private authListenerSubs: Subscription;
  opened = false;

  constructor(
    private authService: AuthService,
    public route: ActivatedRoute,
    private router: Router // private errorService: ErrorService
  ) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userName = this.authService.getUserName();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userName = this.authService.getUserName();
      });
    this.authService.autoAuthUser();
    console.log(this.router.url);
  }
}
// this.errorSub = this.errorService.getErrorListener().subscribe(
//   message => this.hasError = message !== null
// );

// ngOnDestroy() {
//   this.errorSub.unsubscribe();
