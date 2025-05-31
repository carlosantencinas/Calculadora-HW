let grafico;

function convertirUnidadLongitud(valor, unidad) {
  if (unidad === 'km') return valor * 1000;
  return valor; // m
}

function convertirUnidadCaudal(valor, unidad) {
  if (unidad === 'L/s') return valor / 1000; // pasar L/s a m³/s
  return valor; // m³/s
}

function convertirDiametroAMetros(valor, unidad) {
  if (unidad === 'pulgadas') return valor * 0.0254;
  if (unidad === 'mm') return valor / 1000;
  return valor; // metros
}

function actualizarGrafico(Q, L, C) {
  // Diámetros fijos en pulgadas para comparar pérdidas y velocidades
  const diametrosPulgadas = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
  const diametros = diametrosPulgadas.map(p => p * 0.0254);

  const perdidas = diametros.map(d => {
    return 10.67 * L * Math.pow(Q, 1.852) / (Math.pow(C, 1.852) * Math.pow(d, 4.87));
  });

  const velocidades = diametros.map(d => {
    return (4 * Q) / (Math.PI * Math.pow(d, 2));
  });

  const etiquetas = diametros.map(d => `${(d / 0.0254).toFixed(2)} pulg`);

  const ctx = document.getElementById('grafico').getContext('2d');

  if (grafico) {
    grafico.data.labels = etiquetas;
    grafico.data.datasets[0].data = perdidas;
    grafico.data.datasets[1].data = velocidades;
    grafico.update();
  } else {
    grafico = new Chart(ctx, {
      type: 'line',
      data: {
        labels: etiquetas,
        datasets: [
          {
            label: 'Pérdida de carga (m)',
            data: perdidas,
            fill: false,
            borderColor: 'blue',
            tension: 0.3,
            pointRadius: 4,
            yAxisID: 'y',
          },
          {
            label: 'Velocidad (m/s)',
            data: velocidades,
            fill: false,
            borderColor: 'red',
            borderDash: [5, 5],
            tension: 0.3,
            pointRadius: 4,
            yAxisID: 'y1',
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          tooltip: { mode: 'index', intersect: false }
        },
        scales: {
          x: {
            title: { display: true, text: 'Diámetro (pulgadas)' }
          },
          y: {
            beginAtZero: true,
            position: 'left',
            title: {
              display: true,
              text: 'Pérdida de carga (m)'
            }
          },
          y1: {
            beginAtZero: true,
            position: 'right',
            grid: { drawOnChartArea: false },
            title: {
              display: true,
              text: 'Velocidad (m/s)'
            }
          }
        }
      }
    });
  }
}

// Función para calcular la pérdida de carga con los datos ingresados (solo para mostrar en resultados)
function calcularPerdida(Q, L, C, d) {
  // d en metros
  return 10.67 * L * Math.pow(Q, 1.852) / (Math.pow(C, 1.852) * Math.pow(d, 4.87));
}
// Función para calcular la VELOCIDAD con los datos ingresados (solo para mostrar en resultados)
function calcularVelocidad(Q, d) {
  // d en metros
  return  (4 * Q) / (Math.PI * Math.pow(d, 2)); 
}


document.getElementById('calc-form').addEventListener('submit', function (e) {
  e.preventDefault();

  // Leer datos del formulario
  const diamInput = parseFloat(document.getElementById('diam').value);
  const diamUnit = document.getElementById('diam_unit').value;

  const caudalInput = parseFloat(document.getElementById('caudal').value);
  const caudalUnit = document.getElementById('caudal_unit').value;

  const longInput = parseFloat(document.getElementById('long').value);
  const longUnit = document.getElementById('long_unit').value;

  const C = parseFloat(document.getElementById('c').value);

  if (isNaN(diamInput) || diamInput <= 0 ||
      isNaN(caudalInput) || caudalInput <= 0 ||
      isNaN(longInput) || longInput <= 0 ||
      isNaN(C) || C <= 0) {
    alert('Por favor ingresa valores positivos válidos para todos los campos.');
    return;
  }

  // Convertir unidades a sistema métrico estándar
  const diam = convertirDiametroAMetros(diamInput, diamUnit);
  const Q = convertirUnidadCaudal(caudalInput, caudalUnit);
  const L = convertirUnidadLongitud(longInput, longUnit);

  // Calcular pérdida solo para diámetro ingresado
  const perdidaCalculada = calcularPerdida(Q, L, C, diam);

  const VelocidadCalculada = calcularVelocidad(Q, diam);

  // Mostrar resultado
  const resultadosDiv = document.getElementById('resultados');
  resultadosDiv.innerHTML = `
    <p><strong>Pérdida de carga:</strong> ${perdidaCalculada.toFixed(3)} m</p>

    <p><strong>Velocidad:</strong> ${VelocidadCalculada.toFixed(3)} m/s</p>
  `;

  // Actualizar gráfico con los valores ingresados
  actualizarGrafico(Q, L, C);
});

