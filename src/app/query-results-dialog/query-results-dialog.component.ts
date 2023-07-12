import { Component, Inject, OnInit, ViewChild } from '@angular/core';
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
  isLoading = false;

  // Add new properties for pagination
  currentPage = 0;
  pageSize = 200;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { card: Card },
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Load the first chunk of query results
    this.loadQueryResults();
    const rows = document.querySelectorAll('.mat-row');
    rows.forEach((row, index) => {
      if (index % 2 === 1) {
        (row as HTMLElement).style.backgroundColor = '#f5f5f5';
      }
    });
  }

  loadQueryResults() {
    // Set isLoading to true while data is loading
    this.isLoading = true;
    // Get the query and server location from the selected card
    const query = this.data.card.query;
    const serverLocation = this.data.card.serverLocation;

    // Send a request to the server to execute the query and return the results
    this.http
      .get<any[]>('http://localhost:3000/query-results', {
        params: {
          query,
          serverLocation,
          // Add new parameters for pagination
          currentPage: this.currentPage.toString(),
          pageSize: this.pageSize.toString(),
        },
      })
      .subscribe((data) => {
        // Update the data source with the query results
        this.dataSource.data = [...this.dataSource.data, ...data];

        // Set the paginator and sort on the data source
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // Set isLoading to false when data has finished loading
        this.isLoading = false;

        // Increment the current page
        this.currentPage++;
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
    const printWindow = window.open('', '_blank');

    // Write table's HTML to new window's document.
    const tableHtml = this.generateTableHtml(dataToPrint);
    printWindow!.document.write(tableHtml);

    // Open print dialog.
    printWindow!.focus();
    printWindow!.print();

    // Close new window.
    printWindow!.close();
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
  ngAfterViewInit() {
    // Add a scroll event listener to the mat-dialog-content element
    const dialogContentElement = document.querySelector('mat-dialog-content');
    if (dialogContentElement) {
      // Cast the dialogContentElement to an HTMLElement
      const dialogContentHTMLElement = dialogContentElement as HTMLElement;

      // Make the mat-dialog-content element scrollable
      dialogContentHTMLElement.style.height = '400px';
      dialogContentHTMLElement.style.overflow = 'auto';

      dialogContentHTMLElement.addEventListener('scroll', () => {
        // Check if the user has scrolled to the bottom of the mat-dialog-content element
        if (dialogContentHTMLElement.scrollTop + dialogContentHTMLElement.clientHeight >= dialogContentHTMLElement.scrollHeight) {
          // Load the next chunk of data
          this.loadQueryResults();
        }
      });
    }
  }

}
