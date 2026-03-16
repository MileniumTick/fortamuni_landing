export interface ContactFormData {
  nombre: string;
  cargo: string;
  municipalidad: string;
  requerimiento: string;
  email: string;
  telefono?: string;
  _honeypot: string;
}

export interface ApiResponse {
  success: boolean;
  error?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export interface CaseStudyChart {
  canvasId: string;
  type: 'doughnut' | 'bar';
  data: {
    labels: string[];
    values: number[];
    colors: string[];
  };
  title: string;
  horizontal?: boolean;
}

export interface SectionModule {
  init: () => void;
  destroy?: () => void;
}
