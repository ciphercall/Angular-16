// table-page.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { QueryResultsDialogComponent } from '../query-results-dialog/query-results-dialog.component';


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
  cards: Card[] = [];
  nextCardId = 0;

  constructor(private http: HttpClient, private dialog: MatDialog) {}

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

  onCardClick(card: Card) {
    this.dialog.open(QueryResultsDialogComponent, {
      data: {
        card
      }
    });
  }

  deleteCard(card: Card, event: Event) {
    // Prevent the click event from bubbling up to the card element
    event.stopPropagation();

    // Remove the card from the cards array
    this.cards = this.cards.filter((c) => c.id !== card.id);

    // Save the cards to local storage
    localStorage.setItem('cards', JSON.stringify(this.cards));
  }

  loadCards() {
    // Load the cards from local storage
    const cardsJson = localStorage.getItem('cards');
    if (cardsJson) {
      this.cards = JSON.parse(cardsJson);
      this.nextCardId = this.cards.length;
    }
  }

  createCard(
    selectedColumns: string[],
    tableName: string,
    databaseName: string,
    serverLocation: string
  ) {
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
    localStorage.setItem('cards', JSON.stringify(this.cards));
  }
}
