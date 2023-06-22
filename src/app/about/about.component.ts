import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  var_a:string = 'Hello World! The sum is ';
  getNumber:any = sessionStorage.getItem('first_var') ?? 0
  first_var:number = parseInt(this.getNumber) || 34;
  second_var:number = 56;
  ngOnInit(){
    console.log(this.var_a+(this.first_var+this.second_var));
    this.first_var = this.first_var+this.second_var;
    sessionStorage.setItem('first_var', (this.first_var).toString());
  }
}
