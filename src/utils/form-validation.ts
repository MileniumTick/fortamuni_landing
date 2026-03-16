import type { ContactFormData, ValidationResult } from '../types';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[\d\s+()-]{8,20}$/;

function getTrimmedLength(value: string): number {
  return value.trim().length;
}

export function validateForm(data: ContactFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (getTrimmedLength(data.nombre) < 2) {
    errors.nombre = 'Ingrese un nombre válido.';
  }

  if (getTrimmedLength(data.cargo) < 2) {
    errors.cargo = 'Ingrese el cargo de contacto.';
  }

  if (getTrimmedLength(data.municipalidad) < 2) {
    errors.municipalidad = 'Ingrese el nombre de la municipalidad.';
  }

  if (getTrimmedLength(data.email) < 5 || !emailPattern.test(data.email.trim())) {
    errors.email = 'Ingrese un correo electrónico válido.';
  }

  if (data.telefono && getTrimmedLength(data.telefono) > 0 && !phonePattern.test(data.telefono.trim())) {
    errors.telefono = 'Ingrese un teléfono válido.';
  }

  if (getTrimmedLength(data.requerimiento) < 10) {
    errors.requerimiento = 'Describa el requerimiento con mayor detalle.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
