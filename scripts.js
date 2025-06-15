// Función para desplazarse a una sección
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

// Definir todos los slides en orden correcto
const sectionIds = [
  'hero', 'problem', 'solution', 'stakeholders', 
  'methodology', 'timeline', 'risks'
];
let currentSlide = 0;

const slideCounter = document.getElementById('slideCounter');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function updateNavigation() {
  slideCounter.textContent = `${currentSlide + 1}/${sectionIds.length}`;
  prevBtn.disabled = currentSlide === 0;
  nextBtn.disabled = currentSlide === sectionIds.length - 1;
}

function goToSlide(index) {
  if (index >= 0 && index < sectionIds.length) {
    currentSlide = index;
    scrollToSection(sectionIds[index]);
    updateNavigation();
  }
}

prevBtn.addEventListener('click', () => {
  if (currentSlide > 0) {
    goToSlide(currentSlide - 1);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentSlide < sectionIds.length - 1) {
    goToSlide(currentSlide + 1);
  }
});

// Navegación con teclado
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    // Flecha izquierda: slide anterior
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  } else if (e.key === 'ArrowRight') {
    // Flecha derecha: siguiente slide
    if (currentSlide < sectionIds.length - 1) {
      goToSlide(currentSlide + 1);
    }
  }
});

// Inicializar navegación
updateNavigation();

// Inicializar gráfico de riesgo
function initRiskChart() {
  const ctx = document.getElementById("riskChart").getContext("2d");
  return new Chart(ctx, {
    type: 'bubble',
    data: {
      datasets: [
        {
          label: 'Sobrecarga Equipo',
          data: [{ x: 3, y: 3, r: 9 }], // Aumentado el tamaño de la burbuja roja
          backgroundColor: 'rgba(239, 68, 68, 0.9)'
        },
        {
          label: 'Integración APIs',
          data: [{ x: 2, y: 3, r: 6 }],
          backgroundColor: 'rgba(251, 146, 60, 0.7)'
        },
        {
          label: 'Seguridad',
          data: [{ x: 2, y: 2.8, r: 6 }],
          backgroundColor: 'rgba(251, 191, 36, 0.7)'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label}: Nivel ${ctx.raw.r}`
          }
        }
      },
      scales: {
        x: {
          title: { 
            display: true, 
            text: "Probabilidad",
            color: '#f59e0b',
            font: {
              weight: 'bold'
            }
          },
          min: 1, 
          max: 4, // Aumentado el rango para dar espacio
          ticks: {
            color: '#cbd5e1',
            stepSize: 1,
            callback: function(value) {
              const labels = ['Baja', 'Media', 'Alta', ''];
              return labels[value-1];
            }
          },
          grid: {
            color: 'rgba(200, 200, 200, 0.1)'
          }
        },
        y: {
          title: { 
            display: true, 
            text: "Impacto",
            color: '#f59e0b',
            font: {
              weight: 'bold'
            }
          },
          min: 1, 
          max: 4, // Aumentado el rango para dar espacio
          ticks: {
            color: '#cbd5e1',
            stepSize: 1,
            callback: function(value) {
              const labels = ['Bajo', 'Medio', 'Alto', ''];
              return labels[value-1];
            }
          },
          grid: {
            color: 'rgba(200, 200, 200, 0.1)'
          }
        }
      },
      layout: {
        padding: {
          top: 30,
          right: 30,
          bottom: 30,
          left: 30
        }
      }
    }
  });
}

// Inicializar el gráfico cuando la página esté cargada
window.addEventListener('load', function() {
  // Ajustar la barra de progreso al 100%
  document.getElementById('projectProgress').style.width = '100%';
  
  // Inicializar el gráfico de riesgos
  setTimeout(initRiskChart, 300);
});

// También inicializar el gráfico cuando se navega a la sección de riesgos
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.target.id === 'risks') {
      // Si el gráfico no se ha creado aún
      if (!window.riskChart) {
        window.riskChart = initRiskChart();
      }
    }
  });
}, { threshold: 0.1 });

observer.observe(document.getElementById('risks'));