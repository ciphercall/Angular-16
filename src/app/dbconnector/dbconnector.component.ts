import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dbconnector',
  templateUrl: './dbconnector.component.html',
  styleUrls: ['./dbconnector.component.css']
})
export class DBConnectorComponent {
  databaseNames: string[] = [];
  tableNames: string[] = [];
  columnNames: string[] = [];

  constructor(private http: HttpClient) {}

  async displayServerLocation(serverLocation: string) {
    if (!serverLocation) {
      return;
    }

    try {
      const result = await this.http.get<string[]>(`http://localhost:3000/database-names?serverLocation=${serverLocation}`).toPromise();
      if (result) {
        this.databaseNames = result;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async displayTableNames(serverLocation: string, databaseName: string) {
    try {
      const result = await this.http.get<string[]>(`http://localhost:3000/table-names?serverLocation=${serverLocation}&databaseName=${databaseName}`).toPromise();
      if (result) {
        this.tableNames = result;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async displayColumnNames(serverLocation: string, databaseName: string, tableName: string) {
    try {
      const result = await this.http.get<string[]>(`http://localhost:3000/column-names?serverLocation=${serverLocation}&databaseName=${databaseName}&tableName=${tableName}`).toPromise();
      if (result) {
        this.columnNames = result;
      }
    } catch (err) {
      console.error(err);
    }
  }
}
