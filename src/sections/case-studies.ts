export function initCaseStudies(): void {
  const section = document.querySelector<HTMLElement>('[data-case-studies]');
  if (!section) {
    return;
  }

  let hasLoaded = false;

  const revealCharts = () => {
    const skeletons = Array.from(section.querySelectorAll<HTMLElement>('[data-chart-skeleton]'));
    const canvases = Array.from(section.querySelectorAll<HTMLCanvasElement>('canvas'));

    skeletons.forEach((skeleton) => {
      skeleton.classList.add('hidden');
    });

    canvases.forEach((canvas) => {
      canvas.classList.remove('hidden');
    });
  };

  const showChartFallback = () => {
    const skeletons = Array.from(section.querySelectorAll<HTMLElement>('[data-chart-skeleton]'));

    skeletons.forEach((skeleton) => {
      skeleton.classList.remove('chart-skeleton');
      skeleton.classList.add('chart-fallback');
      skeleton.textContent = 'No fue posible cargar la visualización en este momento.';
    });
  };

  const loadCharts = async () => {
    if (hasLoaded) {
      return;
    }

    hasLoaded = true;

    try {
      const { renderCaseStudyCharts } = await import('../components/charts');
      renderCaseStudyCharts();
      revealCharts();
    } catch {
      showChartFallback();
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry?.isIntersecting) {
        return;
      }

      void loadCharts();
      observer.disconnect();
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px 10% 0px',
    },
  );

  observer.observe(section);
}
