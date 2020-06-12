import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";
import { LayOutModule } from "./LayoutComponent/layout.module";

const routes: Routes = [
  { path: "auth", loadChildren: "./auth/auth.module#AuthModule" },
  { path: "", loadChildren: "./auth/auth.module#AuthModule" },
  { path: "", loadChildren: "./LayoutComponent/layout.module#LayOutModule" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
