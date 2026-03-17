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

export interface SectionModule {
  init: () => void;
  destroy?: () => void;
}
