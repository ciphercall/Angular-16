import { Component } from '@angular/core';

@Component({
  selector: 'app-dbconnector',
  templateUrl: './dbconnector.component.html',
  styleUrls: ['./dbconnector.component.css']
})
export class DBConnectorComponent {
  displayServerLocation(serverLocation: string) {
    console.log('Server location:', serverLocation);
  }
}
