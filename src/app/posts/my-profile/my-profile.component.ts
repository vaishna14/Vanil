import { Component, OnInit, OnDestroy, OnChanges } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../../auth/auth.service";
import {PostsService} from "../posts.service";
import {Post} from "../post.model"
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
  posts: Post[] = [];
  groupList = [];

  constructor(private authService: AuthService, private postsService:PostsService) {}

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
      this.postsService
      .getPosts(2, 2)
      .subscribe((data) => {   
        let postList=[]     
        postList = Object.values(data)[1];
        postList.map(item=>{
          console.log(item)
          if (item._id === this.userId){
            this.posts=item;
            this.myProfile =item.myAvatar;
            console.log(item.myAvatar);
          }
        })
      });
    this.postsService.getGroup(this.userId).subscribe((data) => {
      Object.values(data)[0].map((item) => {
        this.groupList.push(item.groupList);
      });
    });
    
    
  }

  ChangeAvatar(name) {
    this.myProfile = name;
    this.showModal = false;
    console.log(name)
    this.postsService.updateMyProfile(this.userId,name).subscribe(response=>{
      console.log(response)
    })
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
