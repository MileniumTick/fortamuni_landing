import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  DoughnutController,
  ArcElement,
  LinearScale,
  Legend,
  Title,
  Tooltip,
} from 'chart.js';
import type { CaseStudyChart } from '../types';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  DoughnutController,
  ArcElement,
  LinearScale,
  Legend,
  Title,
  Tooltip,
);

const chartDefinitions: CaseStudyChart[] = [
  {
    canvasId: 'cartago-chart',
    type: 'doughnut',
    title: 'Distribución estimada de prioridades de inversión',
    data: {
      labels: ['Mantenimiento rutinario', 'Mantenimiento periódico', 'Rehabilitación', 'Mejoramiento'],
      values: [28, 24, 26, 22],
      colors: ['#1a365d', '#2c5282', '#d69e2e', '#ecc94b'],
    },
  },
  {
    canvasId: 'osa-chart',
    type: 'bar',
    title: 'Comparativo estimado de tipologías viales',
    data: {
      labels: ['Red estratégica', 'Red turística', 'Red productiva', 'Red de acceso comunitario'],
      values: [84, 72, 65, 58],
      colors: ['#1a365d', '#2c5282', '#d69e2e', '#ecc94b'],
    },
  },
  {
    canvasId: 'canas-chart',
    type: 'bar',
    title: 'Desglose estimado de valoración de activos',
    horizontal: true,
    data: {
      labels: ['Superficie de ruedo', 'Drenajes', 'Obras complementarias', 'Señalización'],
      values: [91, 68, 54, 22],
      colors: ['#1a365d', '#2c5282', '#d69e2e', '#ecc94b'],
    },
  },
];

export function renderCaseStudyCharts(): void {
  chartDefinitions.forEach((chartDefinition) => {
    const canvas = document.getElementById(chartDefinition.canvasId) as HTMLCanvasElement | null;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    new Chart(context, {
      type: chartDefinition.type,
      data: {
        labels: chartDefinition.data.labels,
        datasets: [
          {
            label: chartDefinition.title,
            data: chartDefinition.data.values,
            backgroundColor: chartDefinition.data.colors,
            borderColor: '#ffffff',
            borderWidth: chartDefinition.type === 'doughnut' ? 4 : 0,
            borderRadius: chartDefinition.type === 'bar' ? 8 : 0,
            maxBarThickness: 42,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: chartDefinition.horizontal ? 'y' : 'x',
        plugins: {
          legend: {
            display: chartDefinition.type === 'doughnut',
            position: 'bottom',
            labels: {
              usePointStyle: true,
              boxWidth: 10,
              color: '#334155',
            },
          },
          title: {
            display: true,
            text: chartDefinition.title,
            color: '#1a365d',
            font: {
              family: 'Inter, system-ui, sans-serif',
              size: 14,
              weight: 700,
            },
            padding: {
              bottom: 16,
            },
          },
          tooltip: {
            backgroundColor: '#1a365d',
            titleFont: {
              family: 'Inter, system-ui, sans-serif',
              weight: 700,
            },
            bodyFont: {
              family: 'Inter, system-ui, sans-serif',
            },
          },
        },
        scales:
          chartDefinition.type === 'bar'
            ? {
                x: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(148, 163, 184, 0.15)',
                  },
                  ticks: {
                    color: '#475569',
                  },
                },
                y: {
                  grid: {
                    display: false,
                  },
                  ticks: {
                    color: '#475569',
                  },
                },
              }
            : undefined,
      },
    });
  });
}
