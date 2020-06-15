import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { Teams } from "./teams.model";

const BACKEND_URL = environment.apiUrl + "/teams/";

@Injectable({
  providedIn: "root",
})
export class TeamsService {
  private posts: Teams[] = [];
  private teamsBarUpdated = new Subject<{ posts: Teams[] }>();

  constructor(private http: HttpClient, private router: Router) {}

  getpieCharts() {
    // const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    console.log(BACKEND_URL);
    return this.http.get(BACKEND_URL);
  }
  getteamsTable() {
    // const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    console.log(BACKEND_URL);
    return this.http.get(BACKEND_URL + "teamsTable");
  }
}
