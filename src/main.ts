import './style.css';
import { initNavigation } from './components/navigation';
import { initScrollAnimations } from './components/scroll-animations';
import { initSmoothScroll } from './components/smooth-scroll';
import { initServices } from './sections/services';
import { initCaseStudies } from './sections/case-studies';
import { initContact } from './sections/contact';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollAnimations();
  initSmoothScroll();
  initServices();
  initCaseStudies();
  initContact();
});
