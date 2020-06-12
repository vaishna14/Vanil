import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";

import { AuthService } from "../auth.service";

@Component({
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css", "../../../app/app.component.css"],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  contact: number;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.userName, form.value.password);
    this.userName = this.authService.getUserName();
    this.firstName = this.authService.getFistName();
    this.lastName = this.authService.getLastName();
    this.email = this.authService.getEmail();
    this.contact = this.authService.getContact();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
