import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";
import { LayOutModule } from "./LayoutComponent/layout.module";
import { TeamComponent } from "./Teams/team/team.component";
import { TeamDetailsComponent } from "./Teams/team-details/team-details.component";

const routes: Routes = [
  { path: "auth", loadChildren: "./auth/auth.module#AuthModule" },
  { path: "", loadChildren: "./auth/auth.module#AuthModule" },
  { path: "", loadChildren: "./LayoutComponent/layout.module#LayOutModule" },
  { path: "teams", component: TeamComponent },
  { path: "teams/MyTeams", component: TeamDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
