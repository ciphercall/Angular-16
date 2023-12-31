// app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { TableComponent } from './table/table.component';
import { LoginComponent } from './login/login.component';
import { LineGraphComponent } from './line-graph/line-graph.component';
import { DBConnectorComponent } from './dbconnector/dbconnector.component';
import { TablePageComponent } from './table-page/table-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'Home' },
  { path: 'about', component: AboutComponent, title: 'About' },
  { path: 'table', component: TableComponent, title: 'Table' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'line-graph', component: LineGraphComponent, title: 'Line Graph' },
  { path: 'db-connector', component: DBConnectorComponent, title: 'DB Connector' },
  { path: 'table-page', component: TablePageComponent, title: 'Table Page' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
