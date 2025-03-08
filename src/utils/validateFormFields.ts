import { emailRegex } from '@/constants';

export const validateName = (data: string, t: any) => {
  let error: string = '';
  if (data.trim().length < 3) {
    error = t('form.errors.name_length');
  }
  if (!data.length) {
    error = t('form.errors.name_required');
  }
  return error;
};

export const validateEmail = (data: string, t: any) => {
  let error: string = '';
  if (!data.match(emailRegex)) {
    error = t('form.errors.email_invalid');
  }
  if (!data.length) {
    error = t('form.errors.email_required');
  }
  return error;
};

export const validatePhone = (data: string, t: any) => {
  let error: string = '';
  if (data.trim().length < 9) {
    error = t('form.errors.phone_length');
  }
  if (!data.length) {
    error = t('form.errors.phone_required');
  }
  return error;
};

export const validateProfession = (data: string, t: any) => {
  let error: string = '';
  if (data.trim().length < 3) {
    error = t('form.errors.profession_length');
  }
  if (!data.length) {
    error = t('form.errors.profession_required');
  }
  return error;
};

export const validateId = (data: string, t: any) => {
  let error: string = '';
  if (data.trim().length < 9) {
    error = t('form.errors.id_length');
  }
  if (!data.length) {
    error = t('form.errors.id_required');
  }
  return error;
};
