import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { PostListComponent } from "../posts/post-list/post-list.component";
import { PostCreateComponent } from "../posts/post-create/post-create.component";
import { LayoutComponent } from "./layout/layout.component";

import { AngularMaterialModule } from "../angular-material.module";
import { LayoutRoutingModule } from "./layout-routing.module";

@NgModule({
  declarations: [LayoutComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    LayoutRoutingModule,
  ],
})
export class LayOutModule {}
