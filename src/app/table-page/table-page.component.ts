import { Component, Input, OnInit, ViewChild, Renderer2, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  selector: 'app-table-page',
  templateUrl: './table-page.component.html',
  styleUrls: ['./table-page.component.css']
})
export class TablePageComponent implements OnInit {
  @Input() selectedColumns: string[] = [];

  cards: Card[] = [];
  nextCardId = 0;

  // Add a new property to store the currently selected card
  selectedCard: Card | null = null;

  // Add new properties for the paginator, sort, and data source
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<any>();

  // Add a new property for storing the page range
  pageRange: [number, number] = [1, 1];

  constructor(private http: HttpClient, private renderer: Renderer2, private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    // Load the cards from local storage
    this.loadCards();

    // Get the selected columns, table name, database name, and server location from the route data
    const state = window.history.state;
    const selectedColumns = state.selectedColumns || [];
    const tableName = state.tableName;
    const databaseName = state.databaseName;
    const serverLocation = state.serverLocation;

    // Only create a new card if the route data contains valid values
    if (selectedColumns.length > 0 && tableName && databaseName && serverLocation) {
      this.createCard(selectedColumns, tableName, databaseName, serverLocation);
    }
  }

print() {
   // Get start and end indices of rows to print.
   const pageSize = this.paginator.pageSize;
   const startIndex = (this.pageRange[0] -1) * pageSize;
   const endIndex = this.pageRange[1] * pageSize;

   // Filter data source to only include rows on specified pages.
   const dataToPrint = this.dataSource.data.slice(startIndex,endIndex);

   // Create a new window.
   const printWindow = this.renderer.createElement('iframe');
   this.renderer.setStyle(printWindow,'position','fixed');
   this.renderer.setStyle(printWindow,'top','-100%');
   this.renderer.appendChild(document.body,printWindow);

   // Write table's HTML to new window's document.
   const tableHtml = this.generateTableHtml(dataToPrint);
   printWindow.contentDocument!.open();
   printWindow.contentDocument!.write(tableHtml);
   printWindow.contentDocument!.close();

   // Open print dialog.
   printWindow.contentWindow!.focus();
   printWindow.contentWindow!.print();

   // Remove new window.
   this.renderer.removeChild(document.body,printWindow);
}

generateTableHtml(data: any[]) {
  let html = '<table>';

  // Add table header
  html += '<thead><tr>';
  for (const column of this.selectedCard!.selectedColumns) {
    html += `<th>${column}</th>`;
  }
  html += '</tr></thead>';

  // Add table body
  html += '<tbody>';
  for (const row of data) {
    html += '<tr>';
    for (const column of this.selectedCard!.selectedColumns) {
      html += `<td>${row[column]}</td>`;
    }
    html += '</tr>';
  }
  html += '</tbody>';

  html += '</table>';
  return html;
}

createCard(selectedColumns: string[], tableName: string, databaseName: string, serverLocation: string) {
    // Generate the query
    const columns = selectedColumns.join(', ');
    const query = `SELECT ${columns} FROM ${databaseName}.dbo.${tableName}`;

    // Create a new card object
    const card: Card = {
      id: this.nextCardId++,
      title: `${tableName}`,
      selectedColumns,
      query,
      serverLocation,
    };

    // Add the card to the cards array
    this.cards.push(card);

    // Save the cards to local storage
    this.saveCards();
  }

  loadCards() {
    // Load the cards from local storage
    const cardsJson = localStorage.getItem('cards');
    if (cardsJson) {
      this.cards = JSON.parse(cardsJson);
      this.nextCardId = this.cards.length;
    }
  }

  saveCards() {
    // Save the cards to local storage
    localStorage.setItem('cards', JSON.stringify(this.cards));
  }

  onCardClick(card: Card) {
    this.selectedCard = card;

    // Send a request to the Node.js server with the card's query and serverLocation as query parameters
    this.http.get(`http://localhost:3000/query-results?query=${card.query}&serverLocation=${card.serverLocation}`).subscribe((results) => {
      // Store the results in the dataSource property
      this.dataSource.data = results as any[];

      // Set the dataSource's paginator and sort
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      // Manually trigger change detection
      this.changeDetectorRef.detectChanges();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteCard(card: Card, event: Event) {
    // Stop event propagation
    event.stopPropagation();

    // Remove the card from the cards array
    this.cards = this.cards.filter((c) => c.id !== card.id);

    // Save the updated cards array to local storage
    this.saveCards();
  }
}
