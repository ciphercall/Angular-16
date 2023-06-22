import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  var_a:string = 'Hello World!';
  ngOnInit(){
    console.log(this.var_a);
  }
}
