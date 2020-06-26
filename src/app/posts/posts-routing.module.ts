import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { PostListComponent } from "./post-list/post-list.component";
import { PostCreateComponent } from "./post-create/post-create.component";
import { MyProfileComponent } from "./my-profile/my-profile.component";
import {EditMyprofileComponent} from "./edit-myprofile/edit-myprofile.component";
import {MyTasksComponent} from "./my-tasks/my-tasks.component"

const routes: Routes = [
  { path: "home", component: PostListComponent, canActivate: [AuthGuard] },
  { path: "create", component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: "mytask", component: MyTasksComponent, canActivate: [AuthGuard] },
  {
    path: "myProfile",
    component: MyProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit/:postId",
    component: EditMyprofileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "editMypost/:postId",
    component: PostCreateComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostsRoutingModule {}
