import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  // Add a new property to store the query results
  queryResults: any[] = [];

  constructor(private http: HttpClient) {}

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

  createCard(selectedColumns: string[], tableName: string, databaseName: string, serverLocation: string) {
    // Generate the query
    const columns = selectedColumns.join(', ');
    const query = `SELECT ${columns} FROM ${databaseName}.dbo.${tableName}`;

    console.log("this is query checker: "+query);

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
    // Send a request to the Node.js server with the card's query and serverLocation as query parameters
    this.http.get(`http://localhost:3000/query-results?query=${card.query}&serverLocation=${card.serverLocation}`).subscribe((results) => {
      // Store the results in the queryResults property
      this.queryResults = results as any[];
      console.log("this is the query results: "+JSON.stringify(this.queryResults));
    });
  }
}
