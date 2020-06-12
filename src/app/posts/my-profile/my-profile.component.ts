import { Component, OnInit, OnDestroy, OnChanges } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../../auth/auth.service";
import * as $ from "jquery";
@Component({
  selector: "app-my-profile",
  templateUrl: "./my-profile.component.html",
  styleUrls: ["./my-profile.component.css", "../../../app/app.component.css"],
})
export class MyProfileComponent implements OnInit {
  userIsAuthenticated = false;
  userName: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  contact: number;
  password: "";
  editField: any;
  editValue: any;
  click: boolean;
  private authListenerSubs: Subscription;
  showModal: boolean;
  profileName: string;
  avatarlist: any;
  myProfile: string;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.avatarlist = [
      "daniel.jpg",
      "elliot.jpg",
      "elyse.png",
      "helen.jpg",
      "jenny.jpg",
      "joe.jpg",
      "kristy.png",
      "matthew.png",
      "molly.png",
      "steve.jpg",
      "stevie.jpg",
      "myprofile.png",
    ];
    this.click = false;
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userName = this.authService.getUserName();
    this.firstName = this.authService.getFistName();
    this.lastName = this.authService.getLastName();
    this.email = this.authService.getEmail();
    this.contact = this.authService.getContact();
    this.userId = this.authService.getUserId();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userName = this.authService.getUserName();
        this.firstName = this.authService.getFistName();
        this.lastName = this.authService.getLastName();
        this.email = this.authService.getEmail();
        this.contact = this.authService.getContact();
        this.userId = this.authService.getUserId();
      });
    this.myProfile == "myprofile.png";
  }

  ChangeAvatar(name) {
    this.myProfile = name;
    this.showModal = false;
  }
  openModal() {
    this.showModal = true;
    // $(".ui.modal").modal("show");
  }

  hide() {
    this.showModal = false;
  }

  change(property: string, event: any) {
    this.click = false;
    this.editField = property;
    if (this.editField == "firstName") {
      console.log(this.editField);
      console.log(event);
      this.firstName = event.target.innerText;
    } else if (this.editField == "lastName") {
      this.lastName = event.target.innerText;
    } else if (this.editField == "userName") {
      this.userName = event.target.innerText;
    } else if (this.editField == "contact") {
      this.contact = event.target.innerText;
    }
  }

  UpdateDetails() {
    console.log(this.firstName);
    this.authService.createUser(
      this.firstName,
      this.lastName,
      this.userName,
      this.contact,
      this.email,
      this.userId
    );
    this.click = true;
  }

  ngOnChanges() {
    this.userName = this.authService.getUserName();
    this.firstName = this.authService.getFistName();
    this.lastName = this.authService.getLastName();
    this.email = this.authService.getEmail();
    this.contact = this.authService.getContact();
  }
  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
