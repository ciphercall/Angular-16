// In table-page.component.ts
import { Component, Input, OnInit } from '@angular/core';

interface Card {
  id: number;
  title: string;
  selectedColumns: string[];
  query: string;
  serverLocation: string; // Add a new property to store the server location
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

    // Create a new card object
    const card: Card = {
      id: this.nextCardId++,
      title: `${tableName}`,
      selectedColumns,
      query,
      serverLocation, // Save the server location to the card object
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
    console.log(card);
  }
}
