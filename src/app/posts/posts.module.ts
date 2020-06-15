import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { PostCreateComponent } from "./post-create/post-create.component";
import { PostListComponent } from "./post-list/post-list.component";
import { MyProfileComponent } from "./my-profile/my-profile.component";
import { AngularMaterialModule } from "../angular-material.module";
import { PostsRoutingModule } from "./posts-routing.module";
import { PaginatorComponent } from "./paginator/paginator.component";

@NgModule({
  declarations: [
    PostCreateComponent,
    PostListComponent,
    MyProfileComponent,
    PaginatorComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
    PostsRoutingModule,
    FormsModule,
  ],
})
export class PostsModule {}
