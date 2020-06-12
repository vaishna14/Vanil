import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

import { environment } from "../../environments/environment";
import { AuthData } from "./auth-data.model";
import { LoginData } from "./login.model";

const BACKEND_URL = environment.apiUrl + "/user/";

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private userName: string;
  private firstName: string;
  private lastName: string;
  private contact: number;
  private email: string;

  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getUserName() {
    return this.userName;
  }

  getFistName() {
    return this.firstName;
  }

  getLastName() {
    return this.lastName;
  }

  getEmail() {
    return this.email;
  }

  getContact() {
    return this.contact;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(
    firstName: string,
    lastName: string,
    userName: string,
    contact: number,
    email: string,
    password: string
  ) {
    const authData: AuthData = {
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      contact: contact,
      email: email,
      password: password,
    };
    this.http.post(BACKEND_URL + "/signup", authData).subscribe(
      (res) => {
        let msg = Object.values(res);
        console.log(msg[0]);
        if (msg[0] !== "User updated!") {
          this.router.navigate(["/"]);
        } else {
          this.router.navigate["/posts/home"];
        }
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }

  login(userName: string, password: string) {
    const authData: LoginData = { userName: userName, password: password };
    this.http
      .post<{
        token: string;
        expiresIn: number;
        userId: string;
        userName: string;
        firstName: string;
        lastName: string;
        email: string;
        contact: number;
      }>(BACKEND_URL + "/login", authData)
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.userName = response.userName;
            this.firstName = response.firstName;
            this.lastName = response.lastName;
            this.email = response.email;
            this.contact = response.contact;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            console.log(expirationDate);
            this.saveAuthData(
              token,
              expirationDate,
              this.userId,
              this.userName,
              this.firstName,
              this.lastName,
              this.email,
              this.contact
            );
            console.log(response);
            this.router.navigate(["/posts/home"]);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.userName = authInformation.userName;
      this.firstName = authInformation.firstName;
      this.lastName = authInformation.lastName;
      this.email = authInformation.email;
      this.contact = +authInformation.contact;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    this.userName = null;
    this.firstName = null;
    this.lastName = null;
    this.email = null;
    this.contact = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    userId: string,
    userName: string,
    firstName: string,
    lastName: string,
    email: string,
    contact: number
  ) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
    localStorage.setItem("userName", userName);
    localStorage.setItem("firstName", firstName);
    localStorage.setItem("lastName", lastName);
    localStorage.setItem("email", email);
    localStorage.setItem("contact", contact.toString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("email");
    localStorage.removeItem("contact");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");
    const email = localStorage.getItem("email");
    const contact = localStorage.getItem("contact");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      userName: userName,
      firstName: firstName,
      lastName: lastName,
      email: email,
      contact: contact,
    };
  }
}
