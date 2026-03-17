import type { ApiResponse, ContactFormData } from '../types';
import { validateForm } from '../utils/form-validation';

function setFieldError(fieldName: string, message = ''): void {
  const input = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${fieldName}"]`);
  const error = document.querySelector<HTMLElement>(`[data-error-for="${fieldName}"]`);

  if (input) {
    input.classList.toggle('error', Boolean(message));
    input.setAttribute('aria-invalid', String(Boolean(message)));

    const describedBy = input.getAttribute('data-describedby');
    if (describedBy) {
      input.setAttribute('aria-describedby', describedBy);
    }
  }

  if (error) {
    error.textContent = message;
    error.classList.toggle('visible', Boolean(message));
  }
}

function clearStatus(): void {
  const status = document.querySelector<HTMLElement>('[data-form-status]');
  if (!status) {
    return;
  }

  status.textContent = '';
  status.classList.add('hidden');
  status.setAttribute('aria-hidden', 'true');
}

function clearErrors(form: HTMLFormElement): void {
  const fields = Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[name], textarea[name]'));
  fields.forEach((field) => setFieldError(field.name));
}

function getFormData(form: HTMLFormElement): ContactFormData {
  const formData = new FormData(form);

  return {
    nombre: String(formData.get('nombre') ?? ''),
    cargo: String(formData.get('cargo') ?? ''),
    municipalidad: String(formData.get('municipalidad') ?? ''),
    requerimiento: String(formData.get('requerimiento') ?? ''),
    email: String(formData.get('email') ?? ''),
    telefono: String(formData.get('telefono') ?? ''),
    _honeypot: String(formData.get('_honeypot') ?? ''),
  };
}

function updateStatus(message: string, isError: boolean): void {
  const status = document.querySelector<HTMLElement>('[data-form-status]');
  if (!status) {
    return;
  }

  status.textContent = message;
  status.classList.remove('hidden', 'border-error', 'text-error', 'border-success', 'text-success');
  status.classList.add(isError ? 'border-error' : 'border-success');
  status.classList.add(isError ? 'text-error' : 'text-success');
  status.setAttribute('aria-hidden', 'false');
}

export function initContact(): void {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  const submitButton = document.querySelector<HTMLButtonElement>('[data-submit-button]');

  if (!form || !submitButton) {
    return;
  }

  const fields = Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[name], textarea[name]'));

  fields.forEach((field) => {
    field.addEventListener('input', () => {
      setFieldError(field.name);
      clearStatus();
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors(form);
    clearStatus();

    const data = getFormData(form);
    const validation = validateForm(data);

    if (!validation.valid) {
      Object.entries(validation.errors).forEach(([field, message]) => {
        setFieldError(field, message);
      });

      const firstErrorField = Object.keys(validation.errors)[0];
      const firstInput = form.querySelector<HTMLElement>(`[name="${firstErrorField}"]`);
      firstInput?.focus();
      updateStatus('Revise los campos marcados antes de enviar.', true);
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    submitButton.setAttribute('aria-busy', 'true');
    updateStatus('Enviando su solicitud de diagnóstico...', false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = (await response.json()) as ApiResponse;

      if (!response.ok || !result.success) {
        throw new Error(result.error ?? 'No fue posible registrar la solicitud de diagnóstico.');
      }

      form.reset();
      updateStatus('Solicitud enviada correctamente. Le contactaremos para coordinar el diagnóstico.', false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
      updateStatus(message, true);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Agendar diagnóstico';
      submitButton.setAttribute('aria-busy', 'false');
    }
  });
}
