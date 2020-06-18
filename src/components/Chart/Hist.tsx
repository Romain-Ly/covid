import React, { useEffect } from 'react';
import Chart from 'chart.js';

export const HistPlot = () => {
  const chartRef = React.createRef<HTMLCanvasElement>();

  useEffect(() => {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [0, 1, 2, 3, 4],
        datasets: [{
          label: 'Group A',
          data: [12, 19, 3, 5],
          backgroundColor: 'rgba(255, 99, 132, 1)',
        }]
      },
      options: {
        scales: {
          xAxes: [{
            display: false,
            //barPercentage: 1.30,
          }, {
            display: true,
          }],
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
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
