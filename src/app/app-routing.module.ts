import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { TableComponent } from './table/table.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path:'',redirectTo:'home', pathMatch:'full'},
  {path:'home', component: HomeComponent, title:'Home'},
  {path:'about', component: AboutComponent, title: "About"},
  {path:'table', component: TableComponent, title: "Table"},
  {path:'login', component: LoginComponent, title: "Login"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
