/* Libs. */
import React, { useEffect } from 'react';
import Chart from 'chart.js';

/* Interfaces. */
export interface HistProp {
  labels: number[]
  data: number[]
  colors: string[]
}

export const HistPlot = (props: HistProp) => {
  const chartRef = React.createRef<HTMLCanvasElement>();

  useEffect(() => {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: props.labels,
        datasets: [{
          label: '',
          data: props.data,
          backgroundColor: props.colors,
        }]
      },
      options: {
        scales: {
          xAxes: [{
            display: true,
          }],
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }],
        },
        legend: {
          display: false,
        }
      }
    });
  });

  return (
    <div className="Histogram">
      <canvas
        id="myChart"
        ref={chartRef}
      />
    </div>
  );
};
