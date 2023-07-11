import { Component, Inject, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

interface Card {
  id: number;
  title: string;
  selectedColumns: string[];
  query: string;
  serverLocation: string;
}

@Component({
  selector: 'app-query-results-dialog',
  templateUrl: './query-results-dialog.component.html',
  styleUrls: ['./query-results-dialog.component.css']
})

export class QueryResultsDialogComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<any>();
  pageRange: [number, number] = [1, 1];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { card: Card },
    private http: HttpClient,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    // Load the query results
    this.loadQueryResults();
    const rows = document.querySelectorAll('.mat-row');
    rows.forEach((row, index) => {
      if (index % 2 === 1) {
        (row as HTMLElement).style.backgroundColor = '#f5f5f5';
      }
    });
  }

  loadQueryResults() {
    // Get the query and server location from the selected card
    const query = this.data.card.query;
    const serverLocation = this.data.card.serverLocation;

    // Send a request to the server to execute the query and return the results
    this.http
      .get<any[]>('http://localhost:3000/query-results', {
        params: {
          query,
          serverLocation,
        },
      })
      .subscribe((data) => {
        // Update the data source with the query results
        this.dataSource.data = data;

        // Set the paginator and sort on the data source
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  print() {
    // Get start and end indices of rows to print.
    const pageSize = this.paginator.pageSize;
    const startIndex = (this.pageRange[0] - 1) * pageSize;
    const endIndex = this.pageRange[1] * pageSize;

    // Filter data source to only include rows on specified pages.
    const dataToPrint = this.dataSource.filteredData.slice(startIndex, endIndex);

    // Create a new window.
    const printWindow = this.renderer.createElement('iframe');
    this.renderer.setStyle(printWindow, 'position', 'fixed');
    this.renderer.setStyle(printWindow, 'top', '-100%');
    this.renderer.appendChild(document.body, printWindow);

    // Write table's HTML to new window's document.
    const tableHtml = this.generateTableHtml(dataToPrint);
    printWindow.contentDocument!.open();
    printWindow.contentDocument!.write(tableHtml);
    printWindow.contentDocument!.close();

    // Open print dialog.
    printWindow.contentWindow!.focus();
    printWindow.contentWindow!.print();

    // Remove new window.
    this.renderer.removeChild(document.body, printWindow);
  }

  generateTableHtml(data: any[]) {
    let html = '<table>';

    // Add table header
    html += '<thead><tr>';
    for (const column of this.data.card.selectedColumns) {
      html += `<th>${column}</th>`;
    }
    html += '</tr></thead>';

    // Add table body
    html += '<tbody>';
    for (const row of data) {
      html += '<tr>';
      for (const column of this.data.card.selectedColumns) {
        html += `<td>${row[column]}</td>`;
      }
      html += '</tr>';
    }
    html += '</tbody>';

    html += '</table>';
    return html;
  }
}
