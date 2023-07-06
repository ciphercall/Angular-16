import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dbconnector',
  templateUrl: './dbconnector.component.html',
  styleUrls: ['./dbconnector.component.css']
})
export class DBConnectorComponent {
  databaseNames: string[] = [];

  constructor(private http: HttpClient) {}

  async displayServerLocation(serverLocation: string) {
    try {
      console.log('clicked!');
      const result = await this.http.get<string[]>(`http://localhost:3000/database-names?serverLocation=${serverLocation}`).toPromise();
      if (result) {
        this.databaseNames = result;
      }
    } catch (err) {
      console.error(err);
    }
  }

}
