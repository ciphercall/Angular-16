// In dbconnector.component.ts
import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-dbconnector',
  templateUrl: './dbconnector.component.html',
  styleUrls: ['./dbconnector.component.css']
})
export class DBConnectorComponent {
  databaseNames: string[] = [];
  tableNames: string[] = [];
  columnNames: string[] = [];
  checkedColumns: { [key: string]: boolean } = {};
  serverName: string = "";

  @ViewChild('tableSelect') tableSelect!: MatSelect;
  @ViewChild('databaseSelect') databaseSelect!: MatSelect;

  constructor(private http: HttpClient, private router: Router) {}

  async displayServerLocation(serverLocation: string) {
    if (!serverLocation) {
      return;
    }

    try {
      const result = await this.http.get<string[]>(`http://localhost:3000/database-names?serverLocation=${serverLocation}`).toPromise();
      if (result) {
        this.databaseNames = result;
        this.serverName = serverLocation;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async displayTableNames(serverLocation: string, databaseName: string) {
    // Reset the checked columns and column names
    this.resetCheckedColumns();
    this.columnNames = [];

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

  isSubmitButtonDisabled() {
    return !Object.values(this.checkedColumns).some((checked) => checked);
  }

  onSubmit() {
    // Get the selected column names, table name, and database name
    const selectedColumns = Object.keys(this.checkedColumns).filter((columnName) => this.checkedColumns[columnName]);
    const tableName = this.tableSelect.value;
    const databaseName = this.databaseSelect.value;
    const serverLocation = this.serverName;

    // Navigate to the table page and pass the selected columns, table name, and database name as route data
    this.router.navigate(['/table-page'], { state: { selectedColumns, tableName, databaseName, serverLocation } });
  }

  resetCheckedColumns() {
    this.checkedColumns = {};
  }
}
