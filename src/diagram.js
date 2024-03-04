import * as chartt from './Chart.min.js';

const ctx = document.getElementById('histogram').getContext('2d');

const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ["Библиотечный алгоритм", "ЦДА", "Брезенхем с действительными данными", "Брезенхем с целочисленными данными", "Брезенхем с устранением ступенчатости", "Ву"],
    datasets: [{
      data: [19, 28, 90, 16, 71, 32],
      backgroundColor: [
        'rgba(216, 27, 96, 0.6)',
        'rgba(3, 169, 244, 0.6)',
        'rgba(255, 152, 0, 0.6)',
        'rgba(29, 233, 182, 0.6)',
        'rgba(156, 39, 176, 0.6)'
      ]
    }]
  },
  options: 
  {
    legend: {
        display: false
        },

    title: {
        display: true,
        text: 'Life Expectancy by Country',
        position: 'top',
        fontSize: 16,
        padding: 20
    },
    scales: 
    {
      xAxes: [{
        display: false,
        barPercentage: 1.3,
        ticks: {
          max: 6,
        }
      }, {
        display: true,
        ticks: {
          autoSkip: false,
          max: 5,
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});