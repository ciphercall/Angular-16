import { Component, OnInit } from '@angular/core';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale);

@Component({
  selector: 'app-line-graph',
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.css']
})
export class LineGraphComponent implements OnInit {
  lineChart: any;
  tableData: any[] = [];
  displayedColumns: string[] = ['month', 'data'];

  constructor() {}

  ngOnInit(): void {
    this.lineChart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Data',
            data: [10, 20, 30, 40, 50, 60],
            fill: false,
            borderColor: '#4bc0c0'
          }
        ]
      },
      options: {
        responsive: true
      }
    });

    this.tableData = this.lineChart.data.labels.map((label: string, index: number) => ({
      month: label,
      data: this.lineChart.data.datasets[0].data[index]
    }));
  }
}
