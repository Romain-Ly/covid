/* Libs. */
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js';

/* Interfaces. */
export interface HistProp {
  labels: number[]
  data: number[]
  colors: string[]
}

export const HistPlot = (props: HistProp) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    if (canvasRef.current) {
      canvasRef.current.destroy();
    }

    canvasRef.current = new Chart(ctx, {
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
      />
    </div>
  );
};
