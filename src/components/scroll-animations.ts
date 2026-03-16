export function initScrollAnimations(): void {
  const animatedElements = Array.from(document.querySelectorAll<HTMLElement>('.animate-on-scroll'));

  if (animatedElements.length === 0) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -10% 0px',
    },
  );

  animatedElements.forEach((element) => observer.observe(element));
}
