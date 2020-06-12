import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { PostListComponent } from "./post-list/post-list.component";
import { PostCreateComponent } from "./post-create/post-create.component";

const routes: Routes = [
  { path: "home", component: PostListComponent, canActivate: [AuthGuard] },
  { path: "create", component: PostCreateComponent, canActivate: [AuthGuard] },
  {
    path: "edit/:postId",
    component: PostCreateComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostsRoutingModule {}
