import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Chart } from 'chart.js';

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
  styleUrls: ['./query-results-dialog.component.css'],
})
export class QueryResultsDialogComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('chart') chartRef!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  dataSource = new MatTableDataSource<any>();
  pageRange: [number, number] = [1, 1];
  isLoading = false;
  currentPage = 0;
  pageSize = 30000;

  // Properties for the line chart
  selectedXColumn = '';
  selectedYColumn = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { card: Card },
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadQueryResults();
    const rows = document.querySelectorAll('.mat-row');
    rows.forEach((row, index) => {
      if (index % 2 === 1) {
        (row as HTMLElement).style.backgroundColor = '#f5f5f5';
      }
    });
    // Set the initial values for the selected columns
    this.selectedXColumn = this.data.card.selectedColumns[0];
    this.selectedYColumn = this.data.card.selectedColumns[1];
  }

  ngAfterViewInit() {
    this.createChart();
    this.updateChartData();
    this.paginator.page.subscribe(() => {
      if (this.paginator.pageIndex === this.paginator.getNumberOfPages() - 1) {
        this.loadQueryResults();
      }
    });
  }

  loadQueryResults() {
    this.isLoading = true;
    const query = this.data.card.query;
    const serverLocation = this.data.card.serverLocation;
    this.http
      .get<any[]>('http://localhost:3000/query-results', {
        params: {
          query,
          serverLocation,
          currentPage: this.currentPage.toString(),
          pageSize: this.pageSize.toString(),
        },
      })
      .subscribe((data) => {
        this.dataSource.data = [...this.dataSource.data, ...data];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
        this.currentPage++;
        // Update the chart data
        this.updateChartData();
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // Update the chart data
    this.updateChartData();
  }

  print() {
    const pageSize = this.paginator.pageSize;
    const startIndex = (this.pageRange[0] - 1) * pageSize;
    const endIndex = this.pageRange[1] * pageSize;
    const dataToPrint = this.dataSource.filteredData.slice(startIndex, endIndex);
    const printWindow = window.open('', '_blank');
    const tableHtml = this.generateTableHtml(dataToPrint);
    printWindow!.document.write(tableHtml);
    printWindow!.focus();
    printWindow!.print();
    printWindow!.close();
  }

  generateTableHtml(data: any[]) {
    let html = '<table>';
    html += '<thead><tr>';
    for (const column of this.data.card.selectedColumns) {
      html += `<th>${column}</th>`;
    }
    html += '</tr></thead>';
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

  // Method to create the chart
  createChart() {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: this.selectedYColumn,
              data: [],
              borderColor: 'black',
              backgroundColor: 'rgba(255,255,0,0.28)',
            },
          ],
        },
        options: {
          responsive: true,
        },
      });
    }
  }

  // Method to update the chart data
  updateChartData() {
    const xColumnData = this.dataSource.filteredData.map(
      (row) => row[this.selectedXColumn]
    );
    const yColumnData = this.dataSource.filteredData.map(
      (row) => row[this.selectedYColumn]
    );
    this.chart.data.labels = xColumnData;
    this.chart.data.datasets[0].data = yColumnData;
    this.chart.data.datasets[0].label = this.selectedYColumn;
    this.chart.update();
  }
}
