import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../auth/auth.service";
import { from } from "rxjs";
import { Subscription } from "rxjs";
import { TeamsService } from "../teams.service";

@Component({
  selector: "app-team",
  templateUrl: "./team.component.html",
  styleUrls: ["./team.component.css"],
})
export class TeamComponent implements OnInit {
  color = "red";
  isLoading = false;
  userIsAuthenticated = false;
  userId: string;
  userName: string;
  private authStatusSub: Subscription;
  showShare: boolean;
  constructor(private authService: AuthService) {}

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
  }
}
